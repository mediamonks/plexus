const OpenAI = require('openai');
const config = require('../utils/config');
const History = require('../utils/History');
const openaiConfig = require('../../config/openai.json');

const apiKey = process.env.OPENAI_API_KEY;
const client = new OpenAI({ apiKey });

async function generateEmbeddings(input, model) {
	model ??= config.get('embeddingModel') ?? openaiConfig.embeddingModel;
	config.set('embeddingModel', model);
	
	const response = await client.embeddings.create({ model, input });
	
	return response.data[0].embedding;
}

async function query(prompt, {
	systemInstructions,
	maxTokens = null,
	temperature = null,
	history = new History(),
	structuredResponse = false,
	model,
} = {}) {
	const messages = [
		...history.toOpenAi(),
		{ role: 'user', content: prompt }
	];
	
	if (systemInstructions) messages.unshift({ role: 'system', content: systemInstructions });
	
	model ??= config.get('model') ?? openaiConfig.model;
	config.set('model', model);
	
	const response = await client.chat.completions.create({
		messages,
		model,
		max_completion_tokens: maxTokens,
		temperature,
		response_format: structuredResponse ? { type: 'json_object' } : undefined,
	});
	
	return response.choices[0].message.content;
}

module.exports = {
	query,
	generateQueryEmbeddings: generateEmbeddings,
	generateDocumentEmbeddings: generateEmbeddings,
	config: openaiConfig,
};
