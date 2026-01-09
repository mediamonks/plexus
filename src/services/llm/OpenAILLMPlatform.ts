import OpenAI from 'openai';
import ILLMPlatform, { QueryOptions } from './ILLMPlatform';
import LLMPlatform from './LLMPlatform';
import History from '../../core/History';
import Profiler from '../../core/Profiler';
import DataSourceItem from '../../entities/data-sources/origin/DataSourceItem';
import UnsupportedError from '../../entities/error-handling/UnsupportedError';
import { staticImplements } from '../../types/common';

@staticImplements<ILLMPlatform>()
export default class OpenAILLMPlatform extends LLMPlatform {
	protected static readonly configModuleName: 'azure' | 'openai' = 'openai';
	
	public static readonly supportedMimeTypes: Set<string> = new Set([
		'application/json',
		'application/pdf',
		'image/gif',
		'image/jpeg',
		'image/png',
		'image/webp',
		'text/plain',
	]);
	
	public static readonly Configuration: {
		model: string;
		embeddingModel: string;
		outputTokens?: number;
	};
	
	protected static _client: OpenAI;
	protected static _embeddingClient: OpenAI;
	private static _cachedEmbeddings: Record<string, Record<string, number[]>> = {};
	
	public static async query(query: string, {
		instructions,
		history,
		model,
		temperature,
		outputTokens,
		structuredResponse,
		files,
		tools,
	}: QueryOptions = {}): Promise<string> {
		model ??= this.configuration.model;
		outputTokens ??= this.outputTokens;
		
		const messages = await this.createMessages(instructions, history, query, files);
		
		const client = await this.getClient(model);
		
		const response = await Profiler.run(async () =>  await client.chat.completions.create({
			messages,
			model,
			max_completion_tokens: outputTokens,
			temperature,
			response_format: structuredResponse ? { type: 'json_object' } : undefined,
		}), 'OpenAILLMPlatform.query');
		
		return response.choices[0].message.content;
	}
	
	public static async generateQueryEmbeddings(text: string, model?: string): Promise<number[]> {
		return await this.generateEmbeddings(text, model);
	}
	
	public static async generateDocumentEmbeddings(text: string, model?: string): Promise<number[]> {
		return await this.generateEmbeddings(text, model);
	}
	
	protected static get configuration(): typeof OpenAILLMPlatform.Configuration {
		return super.configuration as typeof OpenAILLMPlatform.Configuration;
	}
	
	protected static async getClient(_?: string): Promise<OpenAI> {
		return this._client ??= new OpenAI({
			apiKey: process.env.OPENAI_API_KEY,
		});
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
	
	protected static async createMessages(instructions: string, history: History, query: string, files: DataSourceItem<string, unknown>[]): Promise<OpenAI.ChatCompletionMessageParam[]> {
		const fileParts = await this.createFileParts(files);
		
		const content = [{ type: 'text', text: query }, ...fileParts];
		
		const messages = [
			...history.toOpenAi(),
			{ role: 'user', content }
		] as OpenAI.ChatCompletionMessageParam[];
		
		if (instructions) messages.unshift({ role: 'system', content: instructions });
		
		return messages;
	}
	
	protected static async createFileParts(files: DataSourceItem<string, unknown>[]): Promise<OpenAI.ChatCompletionContentPart[]> {
		const supportedImageTypes = new Set([...this.supportedMimeTypes].filter(type => type.startsWith('image/')));
		
		return Promise.all(files.map(async item => {
			if (item.mimeType === 'application/json') return {
				type: 'text' as const,
				text: await item.getTextContent(),
			};
			
			if (item.mimeType === 'application/pdf') return {
				type: 'file' as const,
				file: {
					file_data: await item.toDataUri(),
					filename: item.fileName,
				}
			};
			
			if (supportedImageTypes.has(item.mimeType)) return {
				type: 'image_url' as const,
				image_url: { url: await item.toDataUri() },
			};
			
			if (item.mimeType === 'text/plain') return {
				type: 'text' as const,
				text: await item.toText(),
			};
			
			throw new UnsupportedError('mime type', item.mimeType, Array.from(this.supportedMimeTypes));
		}));
	}
};
