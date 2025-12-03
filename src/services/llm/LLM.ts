import UnsupportedError from '../../entities/error-handling/UnsupportedError';
import ILLMPlatform from './ILLMPlatform';
import AzureLLMPlatform from './AzureLLMPlatform';
import OpenAILLMPlatform from './OpenAILLMPlatform';
import GoogleLLMPlatform from './GoogleLLMPlatform';
import UnknownError from '../../entities/error-handling/UnknownError';
import Config from '../../core/Config';
import History from '../../core/History';
import EMBEDDING_MODELS from '../../../data/embedding-models.json';
import Profiler from '../../core/Profiler';

export default class LLM {
	public static Configuration: {
		platform: string;
		model?: string;
		embeddingPlatform: string;
		embeddingModel?: string;
		temperature?: number;
	};
	
	public static async query(prompt: string, { instructions, temperature, history, structuredResponse, files }: {
		instructions?: string;
		temperature?: number;
		history?: History;
		structuredResponse?: boolean;
		files?: any[];
	}): Promise<string> {
		const { model, temperature: configTemperature } = this.configuration;
		
		temperature ??= configTemperature;
		
		await Profiler.run(async () => await history.ready, 'waiting for history to be ready');
		
		return this.platform.query(prompt, {
			systemInstructions: instructions,
			temperature,
			history,
			structuredResponse,
			model,
			files,
		});
	}
	
	public static async generateDocumentEmbeddings(text: string): Promise<number[]> {
		return await this.embeddingPlatform.generateDocumentEmbeddings(text, this.configuration.embeddingModel);
	}
	
	public static async generateQueryEmbeddings(text: string): Promise<number[]> {
		return await this.embeddingPlatform.generateQueryEmbeddings(text, this.configuration.embeddingModel);
	}
	
	public static get embeddingModel(): string {
		return this.embeddingPlatform.embeddingModel ?? this.configuration.embeddingModel;
	}
	
	public static get dimensions(): number {
		if (!EMBEDDING_MODELS[this.embeddingModel]) throw new UnknownError('dimensions for embedding model ', this.embeddingModel, EMBEDDING_MODELS);
		
		return EMBEDDING_MODELS[this.embeddingModel].dimensions;
	}
	
	public static get supportedMimeTypes(): string[] {
		// TODO make platform (or model?) specific
		return [
			'application/json',
			'application/pdf',
			'image/jpeg',
			'image/png',
			'text/plain',
		];
	}
	
	private static get configuration(): typeof LLM.Configuration {
		return Config.get('llm', { includeGlobal: true });
	}
	
	private static get platform(): ILLMPlatform {
		return this.getPlatformClass(this.configuration.platform);
	}
	
	private static get embeddingPlatform(): ILLMPlatform {
		return this.getPlatformClass(this.configuration.embeddingPlatform);
	}
	
	private static getPlatformClass(platform: string): ILLMPlatform {
		const mapping = {
			azure: AzureLLMPlatform,
			openai: OpenAILLMPlatform,
			google: GoogleLLMPlatform,
		};
		
		const platformClass = mapping[platform];
		
		if (!platformClass) throw new UnsupportedError('LLM platform', platform, Object.keys(mapping));
		
		return platformClass;
	}
};
