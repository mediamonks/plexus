import path from 'node:path';
import OpenAI from 'openai';
import ILLMPlatform, { QueryOptions } from './ILLMPlatform';
import LLMPlatform from './LLMPlatform';
import ILocalLLMPlatformImage from './local/ILocalLLMPlatformImage';
import LocalLLMPlatformImageTGI from './local/LocalLLMPlatformImageTGI';
import LocalLLMPlatformImageLlamaCpp from './local/LocalLLMPlatformImageLlamaCpp';
import Docker, { ContainerOptions } from '../docker/Docker';
import Config from '../../core/Config';
import Debug from '../../core/Debug';
import History from '../../core/History';
import CustomError from '../../entities/error-handling/CustomError';
import DataSourceItem from '../../entities/data-sources/origin/DataSourceItem';
import UnsupportedError from '../../entities/error-handling/UnsupportedError';
import { staticImplements } from '../../types/common';

const CONTAINER_PORT = 80;

const IMAGES: Record<string, ILocalLLMPlatformImage> = {
	tgi: new LocalLLMPlatformImageTGI(),
	llamacpp: new LocalLLMPlatformImageLlamaCpp(),
};

@staticImplements<ILLMPlatform>()
export default class LocalLLMPlatform extends LLMPlatform {
	protected static readonly configModuleName: 'local-llm' = 'local-llm';
	
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
		image: 'tgi' | 'llamacpp';
		outputTokens?: number;
		contextSize?: number;
		visionProjector?: string;
	};
	
	private static _client: OpenAI;
	
	public static async generateQueryEmbeddings(text: string, model?: string): Promise<number[]> {
		throw new CustomError('Not implemented');
	}
	
	public static async generateDocumentEmbeddings(text: string, model?: string): Promise<number[]> {
		throw new CustomError('Not implemented');
	}
	
	public static get embeddingModel(): string {
		throw new CustomError('Not implemented');
	}
	
	public static async query(query: string, { instructions, history, outputTokens, temperature, files, tools }: QueryOptions): Promise<string> {
		outputTokens ??= this.outputTokens;
		
		const messages = await this.createMessages(query, instructions, history, files);
		
		Debug.dump('LocalLLMPlatform messages', messages);
		
		const client = await this.getClient();
		
		const result = await client.chat.completions.create({
			model: 'local',
			messages,
			max_completion_tokens: outputTokens,
			temperature,
		});
		
		return result.choices[0].message.content ?? '';
	}
	
	private static async createMessages(query: string, instructions: string, history: History, files: DataSourceItem<string, unknown>[]): Promise<OpenAI.Chat.Completions.ChatCompletionMessageParam[]> {
		const userContent = await this.image.createUserContent(query, files);
		
		return [
			{ role: 'system', content: instructions },
			...history.toOpenAi(),
			{ role: 'user', content: userContent },
		];
	}
	
	protected static get configuration(): typeof LocalLLMPlatform.Configuration {
		return super.configuration as typeof LocalLLMPlatform.Configuration;
	}
	
	private static async getClient(): Promise<OpenAI> {
		if (this._client) return this._client;
		
		const ports = await Docker.start(this.getContainerOptions());
		
		return this._client = new OpenAI({
			baseURL: `http://localhost:${ports[CONTAINER_PORT]}/v1`,
			apiKey: 'not-needed',
		});
	}
	
	private static get image(): ILocalLLMPlatformImage {
		return IMAGES[this.configuration.image];
	}
	
	private static getContainerOptions(): ContainerOptions {
		const localCacheDir = path.resolve(Config.get('tempPath'), 'hf-data');
		const { env, cmd } = this.image.getContainerOptions({ contextSize: 32768, ...this.configuration });
		
		return {
			image: this.image.imageName,
			ports: [CONTAINER_PORT],
			binds: [`${localCacheDir}:${this.image.cacheBindPath}`],
			env,
			cmd,
			gpu: true,
			healthCheck: { port: CONTAINER_PORT, path: this.image.healthEndpoint },
		};
	}
	
	public static async createFileParts(files: DataSourceItem<string, unknown>[]): Promise<OpenAI.Chat.Completions.ChatCompletionContentPart[]> {
		const supportedImageTypes = new Set([...this.supportedMimeTypes].filter(type => type.startsWith('image/')));
		
		return Promise.all(files.map(async item => {
			if (item.mimeType === 'application/json') return {
				type: 'text' as const,
				text: await item.getTextContent(),
			};
			
			if (item.mimeType === 'application/pdf') return {
				type: 'text' as const,
				text: await item.toText(),
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
}
