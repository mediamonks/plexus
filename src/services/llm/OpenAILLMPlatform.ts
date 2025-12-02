import OpenAI from 'openai';
import ILLMPlatform, { QueryOptions } from './ILLMPlatform';
import CustomError from '../../entities/error-handling/CustomError';
import Config from '../../core/Config';
import { staticImplements } from '../../types/common';
import History from '../../core/History';

type Configuration = {
	apiVersion: string; // TODO implement?
	model: string;
	embeddingModel: string;
};

@staticImplements<ILLMPlatform>()
export default class OpenAILLMPlatform {
	private static _client: OpenAI;
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
		
		const response = await this.client.chat.completions.create({
			messages,
			model,
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
	
	private static get configuration(): Configuration {
		return Config.get('openai', { includeGlobal: true }) as Configuration;
	}
	
	private static async generateEmbeddings(input: string, model?: string): Promise<number[]> {
		model ??= this.embeddingModel;
		
		const cachedEmbeddings = this._cachedEmbeddings[model]?.[input];
		
		if (cachedEmbeddings) return cachedEmbeddings;
		
		const response = await this.client.embeddings.create({ model, input });
		
		const vector = response.data[0].embedding;
		
		this._cachedEmbeddings[model] ??= {};
		this._cachedEmbeddings[model][input] = vector;
		
		return vector;
	}
	
	private static get client(): OpenAI {
		if (this._client) return this._client;
		
		return this._client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
	}
};
