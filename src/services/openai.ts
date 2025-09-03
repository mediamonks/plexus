import OpenAI from 'openai';
import config from '../utils/config';
import History from '../utils/History';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateEmbeddings(input: string, model?: string): Promise<number[]> {
	model ??= config.get('openai/embeddingModel') as string;
	
	const response = await client.embeddings.create({ model, input });
	
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
	if (files && files.length) throw new Error('OpenAI implementation does not yet support file uploads');
	
	const messages = [
		...history.toOpenAi(),
		{ role: 'user', content: prompt }
	];
	
	if (systemInstructions) messages.unshift({ role: 'system', content: systemInstructions });
	
	model ??= config.get('openai/model') as string;
	
	const response = await client.chat.completions.create({
		messages,
		model,
		max_completion_tokens: maxTokens,
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
