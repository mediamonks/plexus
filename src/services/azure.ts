import OpenAI from 'openai';
import { ConfidentialClientApplication } from '@azure/msal-node';
import CustomError from '../entities/error-handling/CustomError';
import config from '../utils/config';
import History from '../utils/History';

const { AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET } = process.env;

let accessToken = null;
let expiresOnTimestamp = 0;

async function getAccessToken(): Promise<string> {
	if (accessToken && expiresOnTimestamp > Date.now() + 60000) {
		return accessToken;
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
		accessToken = newAccessToken;
		expiresOnTimestamp = expiresOn.getTime();
		return accessToken;
	} catch (error) {
		throw new CustomError(`Error acquiring access token: ${error}`);
	}
}

async function createOpenAIClient(baseURL: string): Promise<OpenAI> {
	const token = await getAccessToken();
	
	return new OpenAI({
		baseURL,
		defaultHeaders: {
			Authorization: `Bearer ${token}`,
		},
		defaultQuery: { 'api-version': config.get('azure/apiVersion') as string },
	});
}

async function createOpenAIChatCompletionClient(model?: string): Promise<OpenAI> {
	const deploymentName = model ?? config.get('azure/deploymentName');
	return createOpenAIClient(`${config.get('azure/baseUrl')}/openai/deployments/${deploymentName}`);
}

async function createOpenAIEmbeddingsClient(model?: string): Promise<OpenAI> {
	model ??= config.get('azure/embeddingModel') as string;
	return createOpenAIClient(`${config.get('azure/baseUrl')}/openai/deployments/${model}/embeddings?api-version=${config.get('azure/embeddingApiVersion')}`);
}

async function generateEmbeddings(text: string, model?: string): Promise<number[]> {
	const client = await createOpenAIEmbeddingsClient(model);
	
	const response = await client.embeddings.create({
		model,
		input: text,
	});
	
	return response.data[0].embedding;
}

async function query(prompt: string, {
	systemInstructions,
	maxTokens = null,
	temperature = null,
	history = new History(),
	structuredResponse = false,
	model,
	files,
}: {
	systemInstructions?: string;
	maxTokens?: number | null;
	temperature?: number | null;
	history?: any;
	structuredResponse?: boolean;
	model?: string;
	files?: any[];
} = {}): Promise<string> {
	if (files && files.length) throw new CustomError('Azure implementation does not yet support file uploads');
	
	const messages = [
		...history.toOpenAi(),
		{ role: 'user', content: prompt }
	];
	
	if (systemInstructions) messages.unshift({ role: 'system', content: systemInstructions });
	
	const client = await createOpenAIChatCompletionClient(model);
	
	const response = await client.chat.completions.create({
		messages,
		model: config.get('azure/deploymentName') as string, // TODO construct/retrieve deploymentName based on model selection?
		max_tokens: maxTokens,
		temperature,
		response_format: structuredResponse ? { type: 'json_object' } : undefined,
	});
	
	return response.choices[0].message.content;
}

export default {
	query,
	generateQueryEmbeddings: generateEmbeddings,
	generateDocumentEmbeddings: generateEmbeddings,
};
