import UnsupportedError from '../../entities/error-handling/UnsupportedError';
import ILLMPlatform from './ILLMPlatform';
import AzureLLMPlatform from './AzureLLMPlatform';
import OpenAILLMPlatform from './OpenAILLMPlatform';
import GoogleLLMPlatform from './GoogleLLMPlatform';
import UnknownError from '../../entities/error-handling/UnknownError';
import Config from '../../core/Config';
import History from '../../core/History';
import EMBEDDING_MODELS from '../../../data/embedding-models.json';

type Configuration = {
	platform: string;
	model: string;
	temperature?: number;
};

export default class LLM {
	public static async query(prompt: string, { instructions, temperature, history, structuredResponse, files }: {
		instructions?: string;
		temperature?: number;
		history?: History;
		structuredResponse?: boolean;
		files?: any[];
	}): Promise<string> {
		const { model, temperature: configTemperature } = Config.get('llm', { includeGlobal: true }) as Configuration;
		
		temperature ??= configTemperature;
		
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
		return await this.embeddingPlatform.generateDocumentEmbeddings(text);
	}
	
	public static async generateQueryEmbeddings(text: string): Promise<number[]> {
		return await this.embeddingPlatform.generateQueryEmbeddings(text);
	}
	
	public static get embeddingModel(): string {
		return this.embeddingPlatform.embeddingModel;
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
	
	private static get platform(): ILLMPlatform {
		return this.getPlatformClass(Config.get('llm/platform', { includeGlobal: true }) as Configuration['platform']);
	}
	
	private static get embeddingPlatform(): ILLMPlatform {
		return this.getPlatformClass(Config.get('llm/embeddingPlatform', { includeGlobal: true }) as Configuration['platform']);
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
