import OpenAI from 'openai';
import ILLMPlatform, { QueryOptions } from './ILLMPlatform';
import CustomError from '../../entities/error-handling/CustomError';
import Config from '../../core/Config';
import History from '../../core/History';
import { staticImplements } from '../../types/common';

@staticImplements<ILLMPlatform>()
export default class OpenAILLMPlatform {
	public static Configuration: {
		model: string;
		embeddingModel: string;
	};
	
	protected static _client: OpenAI;
	protected static _embeddingClient: OpenAI;
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
		// TODO implement support
		if (files && files.length) throw new CustomError('OpenAI file content not yet supported');
		
		const messages = [
			...history.toOpenAi(),
			{ role: 'user', content: query }
		] as OpenAI.ChatCompletionMessageParam[];
		
		if (systemInstructions) messages.unshift({ role: 'system', content: systemInstructions });
		
		model ??= this.configuration.model;
		
		const client = await this.getClient(model);
		
		const response = await client.chat.completions.create({
			messages,
			model,
			max_tokens: maxTokens,
			max_completion_tokens: maxTokens,
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
	
	protected static get configuration(): typeof OpenAILLMPlatform.Configuration {
		return Config.get('openai', { includeGlobal: true });
	}
	
	protected static async getClient(_?: string): Promise<OpenAI> {
		return this._client ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
	}
	
	protected static async getEmbeddingClient(_?: string): Promise<OpenAI> {
		return this.getClient();
	}
	
	protected static async generateEmbeddings(input: string, model?: string): Promise<number[]> {
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
};
