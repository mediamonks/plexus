import OpenAI from 'openai';
import { ConfidentialClientApplication } from '@azure/msal-node';
import ILLMPlatform from './ILLMPlatform';
import OpenAILLMPlatform from './OpenAILLMPlatform';
import CustomError from '../../entities/error-handling/CustomError';
import Config from '../../core/Config';
import { staticImplements } from '../../types/common';

const { AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET } = process.env;
const ACCESS_TOKEN_TTL_MS = 60000;

@staticImplements<ILLMPlatform>()
export default class AzureLLMPlatform extends OpenAILLMPlatform {
	public static Configuration: typeof OpenAILLMPlatform.Configuration & {
		baseUrl: string;
		apiVersion: string;
		embeddingApiVersion: string;
	};
	
	private static _accessToken: string;
	private static _expirationTimestamp: number;
	
	protected static get configuration(): typeof AzureLLMPlatform.Configuration {
		return Config.get('azure', { includeGlobal: true });
	}
	
	protected static async getClient(model?: string): Promise<OpenAI> {
		if (this._client) return this._client;
		
		const token = await this.getAccessToken();
		
		const { model: configModel, baseUrl, apiVersion } = this.configuration;
		
		model ??= configModel;
		
		const baseURL = `${baseUrl}/openai/deployments/${model}`;
		
		return this._client = new OpenAI({
			baseURL,
			defaultHeaders: {
				Authorization: `Bearer ${token}`,
			},
			defaultQuery: { 'api-version': apiVersion },
		});
	}
	
	protected static async getEmbeddingClient(model?: string): Promise<OpenAI> {
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
