const fs = require('node:fs');
const aiplatform = require('@google-cloud/aiplatform');
// TODO refactor to use genAI lib
const { VertexAI } = require('@google-cloud/vertexai');
const mimeTypes = require('mime-types');
const History = require('../utils/History');
const config = require('../utils/config');

const { projectId: project, location, embeddingLocation } = config.get('vertexai', true);
const vertexAI = new VertexAI({ project, location });
const predictionServiceClient = new aiplatform.v1.PredictionServiceClient({
	apiEndpoint: `${embeddingLocation}-aiplatform.googleapis.com`,
});

let last;

async function query(query, {
	systemInstructions,
	history = new History(),
	temperature,
	maxTokens = null,
	datastoreIds = [],
	structuredResponse = false,
	model,
	files = [],
}) {
	const parts = [{ text: query }];
	
	for (const file of files) {
		if (file.toLowerCase().startsWith('gs://')) {
			parts.push({ text: file });
		} else {
			parts.push({
				inlineData: {
					mimeType: mimeTypes.lookup(file),
					data: await fs.promises.readFile(file, { encoding: 'base64' }),
				},
			});
		}
	}
	
	const contents = [
		...history.toVertexAi(),
		{ role: 'user', parts }
	];
	
	let tools = [];
	for (const datastoreId of datastoreIds) {
		const datastore = `projects/${config.get('vertexai/projectId', true)}/locations/${config.get('vertexai/datastoreLocation', true) ?? 'global'}/collections/default_collection/dataStores/${datastoreId}`;
		
		tools.push({
			retrieval: {
				vertexAiSearch: {
					datastore,
				},
			},
		});
	}
	
	model ??= config.get('vertexai/model');
	
	const generativeModel = vertexAI.getGenerativeModel({ model });
	
	const generationConfig = {
		temperature,
		maxOutputTokens: maxTokens && Math.min(maxTokens, 8192)
	};
	
	if (structuredResponse) generationConfig.responseMimeType = 'application/json';
	
	if (last) {
		const delay = config.get('vertexai/quotaDelayMs', true) ?? 0;
		while (last + delay > performance.now()) await new Promise(resolve => setTimeout(resolve, last + delay - performance.now()));
		last = performance.now();
	}
	
	const result = await generativeModel.generateContent({
		contents,
		systemInstruction: systemInstructions,
		generationConfig,
		tools,
	});
	
	return result.response.candidates[0].content.parts[0].text;
}

async function generateEmbeddings(text, model, taskType) {
	model ??= config.get('vertexai/embeddingModel');
	
	const endpoint = `projects/${project}/locations/${config.get('vertexai/embeddingLocation', true)}/publishers/google/models/${model}`;
	const instances = [aiplatform.helpers.toValue({ content: text, task_type: taskType })];
	
	const [response] = await predictionServiceClient.predict({ endpoint, instances });
	
	return response.predictions[0].structValue.fields.embeddings.structValue.fields.values.listValue.values.map(v => v.numberValue);
}

async function generateQueryEmbeddings(text, model) {
	return await generateEmbeddings(text, model, 'RETRIEVAL_QUERY');
}

async function generateDocumentEmbeddings(text, model) {
	return await generateEmbeddings(text, model, 'RETRIEVAL_DOCUMENT');
}

module.exports = {
	query,
	generateQueryEmbeddings,
	generateDocumentEmbeddings,
};
