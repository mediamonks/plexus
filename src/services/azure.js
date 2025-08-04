const OpenAI = require('openai');
const { ConfidentialClientApplication } = require('@azure/msal-node');
const config = require('../utils/config');
const History = require('../utils/History');
const azureConfig = require('../../config/azure.json');

const { AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET } = process.env;

let accessToken = null;
let expiresOnTimestamp = 0;

async function getAccessToken() {
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
		throw new Error(`Error acquiring access token: ${error}`);
	}
}

async function createOpenAIClient(baseURL) {
	const token = await getAccessToken();
	
	return new OpenAI({
		baseURL,
		defaultHeaders: {
			Authorization: `Bearer ${token}`,
		},
		defaultQuery: { 'api-version': azureConfig.apiVersion },
	});
}

async function createOpenAIChatCompletionClient(model) {
	const deploymentName = model ?? config.get('model') ?? azureConfig.deploymentName;
	config.set('model', deploymentName);
	return createOpenAIClient(`${azureConfig.baseUrl}/openai/deployments/${deploymentName}`);
}

async function createOpenAIEmbeddingsClient(model) {
	model ??= config.get('embeddingModel') ?? azureConfig.embeddingModel;
	config.set('embeddingModel', model);
	return createOpenAIClient(`${azureConfig.baseUrl}/openai/deployments/${model}/embeddings?api-version=${azureConfig.embeddingApiVersion}`);
}

async function generateEmbeddings(text, model) {
	const client = await createOpenAIEmbeddingsClient(model);
	
	const response = await client.embeddings.create({
		input: text,
	});
	
	return response.data[0].embedding;
}

async function query(prompt, {
	systemInstructions,
	maxTokens = null,
	temperature = null,
	history = new History(),
	structuredResponse = false,
	model,
	files,
} = {}) {
	if (files && files.length) throw new Error('Azure implementation does not yet support file uploads');
	
	const messages = [
		...history.toOpenAi(),
		{ role: 'user', content: prompt }
	];
	
	if (systemInstructions) messages.unshift({ role: 'system', content: systemInstructions });
	
	const client = await createOpenAIChatCompletionClient(model);
	
	const response = await client.chat.completions.create({
		messages,
		model: config.get('model') ?? azureConfig.deploymentName, // TODO construct/retrieve deploymentName based on model selection?
		max_tokens: maxTokens,
		temperature,
		response_format: structuredResponse ? { type: 'json_object' } : undefined,
	});
	
	return response.choices[0].message.content;
}

module.exports = {
	query,
	generateQueryEmbeddings: generateEmbeddings,
	generateDocumentEmbeddings: generateEmbeddings,
	config: azureConfig, // TODO eliminate?
};
