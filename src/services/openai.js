const OpenAI = require('openai');
const config = require('../utils/config');
const History = require('../utils/History');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateEmbeddings(input, model) {
	model ??= config.get('openai/embeddingModel');
	
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
	files,
} = {}) {
	if (files && files.length) throw new Error('OpenAI implementation does not yet support file uploads');
	
	const messages = [
		...history.toOpenAi(),
		{ role: 'user', content: prompt }
	];
	
	if (systemInstructions) messages.unshift({ role: 'system', content: systemInstructions });
	
	model ??= config.get('openai/model');
	
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
};
