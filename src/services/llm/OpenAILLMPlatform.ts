import OpenAI from 'openai';
import ILLMPlatform, { QueryOptions } from './ILLMPlatform';
import DataSourceItem from '../../entities/data-sources/origin/DataSourceItem';
import Config from '../../core/Config';
import { staticImplements } from '../../types/common';
import UnsupportedError from '../../entities/error-handling/UnsupportedError';
import Profiler from '../../core/Profiler';

@staticImplements<ILLMPlatform>()
export default class OpenAILLMPlatform {
	public static readonly supportedMimeTypes: Set<string> = new Set([
		'application/json',
		'application/pdf',
		'image/jpeg',
		'image/png',
		'text/plain',
	]);
	
	public static Configuration: {
		model: string;
		embeddingModel: string;
	};
	
	protected static _client: OpenAI;
	protected static _embeddingClient: OpenAI;
	private static _cachedEmbeddings: Record<string, Record<string, number[]>> = {};
	
	public static async query(query: string, {
		instructions,
		history,
		temperature,
		maxTokens,
		structuredResponse,
		model,
		files
	}: QueryOptions = {}): Promise<string> {
		const fileParts = await this.createFileParts(files);
		
		const content = [{ type: 'text', text: query }, ...fileParts];
		
		const messages = [
			...history.toOpenAi(),
			{ role: 'user', content }
		] as OpenAI.ChatCompletionMessageParam[];
		
		if (instructions) messages.unshift({ role: 'system', content: instructions });
		
		model ??= this.configuration.model;
		
		const client = await this.getClient(model);
		
		const response = await Profiler.run(async () =>  await client.chat.completions.create({
			messages,
			model,
			max_completion_tokens: maxTokens,
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
	
	public static get embeddingModel(): string {
		return this.configuration.embeddingModel;
	}
	
	protected static get configuration(): typeof OpenAILLMPlatform.Configuration {
		return Config.get('openai', { includeGlobal: true });
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
	
	protected static async createFileParts(files: DataSourceItem<string, unknown>[]): Promise<OpenAI.ChatCompletionContentPart[]> {
		const SUPPORTED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/gif', 'image/webp']);
		
		return Promise.all(files.map(async item => {
			if (item.mimeType === 'text/plain') return {
				type: 'text' as const,
				text: await item.toText(),
			};
			
			if (item.mimeType === 'application/json') return {
				type: 'text' as const,
				text: await item.getTextContent(),
			};
			
			const base64 = await item.toBase64();
			const dataUri = `data:${item.mimeType};base64,${base64}`;
			
			if (SUPPORTED_IMAGE_TYPES.has(item.mimeType)) return {
				type: 'image_url' as const,
				image_url: { url: dataUri },
			};
			
			if (item.mimeType === 'application/pdf') return {
				type: 'file' as const,
				file: {
					file_data: `data:${item.mimeType};base64,${base64}`,
					filename: item.fileName,
				}
			};
			
			throw new UnsupportedError('mime type', item.mimeType, Array.from(this.supportedMimeTypes));
		}));
	}
};
