import OpenAI from 'openai';
import { ConfidentialClientApplication } from '@azure/msal-node';
import ILLMPlatform, { QueryOptions } from './ILLMPlatform';
import CustomError from '../../entities/error-handling/CustomError';
import Config from '../../core/Config';
import { staticImplements } from '../../types/common';
import History from '../../core/History';

type Configuration = {
	baseUrl: string;
	apiVersion: string;
	deploymentName: string;
	embeddingApiVersion: string;
	embeddingModel: string;
};

const { AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET } = process.env;
const ACCESS_TOKEN_TTL_MS = 60000;

@staticImplements<ILLMPlatform>()
export default class AzureLLMPlatform {
	private static _client: OpenAI;
	private static _embeddingClient: OpenAI;
	private static _accessToken: string;
	private static _expirationTimestamp: number;
	private static _cachedEmbeddings: Record<string, Record<string, number[]>> = {};
	
	public static async query(query: string, {
		systemInstructions,
		history = new History(),
		temperature,
		maxTokens,
		structuredResponse,
		model,
		files
	}: QueryOptions = {}): Promise<string> {
		if (files && files.length) throw new CustomError('Azure OpenAI file content not yet supported');
		
		const messages = [
			...history.toOpenAi(),
			{ role: 'user', content: query }
		];
		
		if (systemInstructions) messages.unshift({ role: 'system', content: systemInstructions });
		
		model ??= this.configuration.deploymentName;
		
		const client = await this.getClient(model);
		
		const response = await client.chat.completions.create({
			messages,
			model,
			max_tokens: maxTokens,
			temperature,
			response_format: structuredResponse ? { type: 'json_object' } : undefined,
		});

		return response.choices[0].message.content;
	}
	
	public static async generateQueryEmbeddings(text: string, model?: string): Promise<number[]> {
		return await this.generateEmbeddings(text, model);
	}
	
	public static async generateDocumentEmbeddings(text: string, model?: string): Promise<number[]> {
		return await this.generateEmbeddings(text, model);
	}
	
	public static get embeddingModel(): string {
		return this.configuration.embeddingModel;
	}
	
	private static get configuration(): Configuration {
		return Config.get('azure', { includeGlobal: true }) as Configuration;
	}
	
	private static async generateEmbeddings(input: string, model?: string): Promise<number[]> {
		model ??= this.embeddingModel;
		
		const cachedEmbeddings = this._cachedEmbeddings[model]?.[input];
		
		if (cachedEmbeddings) return cachedEmbeddings;
		
		const client = await this.getEmbeddingClient(model);
		
		const response = await client.embeddings.create({ model, input });
		
		const vector = response.data[0].embedding;
		
		this._cachedEmbeddings[model] ??= {};
		this._cachedEmbeddings[model][input] = vector;
		
		return vector;
	}
	
	private static async getClient(model?: string): Promise<OpenAI> {
		if (this._client) return this._client;
		
		const token = await this.getAccessToken();
		
		const { deploymentName, baseUrl, apiVersion } = this.configuration;
		
		model ??= deploymentName;
		
		const baseURL = `${baseUrl}/openai/deployments/${model}`;
		
		return this._client = new OpenAI({
			baseURL,
			defaultHeaders: {
				Authorization: `Bearer ${token}`,
			},
			defaultQuery: { 'api-version': apiVersion },
		});
	}
	
	private static async getEmbeddingClient(model?: string): Promise<OpenAI> {
		if (this._embeddingClient) return this._embeddingClient;
		
		const token = await this.getAccessToken();
		
		const { baseUrl, embeddingApiVersion, apiVersion } = this.configuration;

		const baseURL = `${baseUrl}/openai/deployments/${model}/embeddings?api-version=${embeddingApiVersion}`;
		
		return this._embeddingClient = new OpenAI({
			baseURL,
			defaultHeaders: {
				Authorization: `Bearer ${token}`,
			},
			defaultQuery: { 'api-version': apiVersion },
		});
	}
	
	private static async getAccessToken(): Promise<string> {
		if (this._accessToken && this._expirationTimestamp > Date.now() + ACCESS_TOKEN_TTL_MS) {
			return this._accessToken;
		}
		
		const auth = {
			clientId: AZURE_CLIENT_ID,
			clientSecret: AZURE_CLIENT_SECRET,
			authority: `https://login.microsoftonline.com/${AZURE_TENANT_ID}`
		};
		const app = new ConfidentialClientApplication({ auth });
		const scopes = ['https://cognitiveservices.azure.com/.default'];
		
		try {
			const { accessToken: newAccessToken, expiresOn } = await app.acquireTokenByClientCredential({ scopes });
			this._accessToken = newAccessToken;
			this._expirationTimestamp = expiresOn.getTime();
			return this._accessToken;
		} catch (error) {
			throw new CustomError(`Error acquiring access token: ${error}`);
		}
	}
};
