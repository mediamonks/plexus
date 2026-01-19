import ILLMPlatform from './ILLMPlatform';
import AzureLLMPlatform from './AzureLLMPlatform';
import GoogleLLMPlatform from './GoogleLLMPlatform';
import LocalLLMPlatform from './LocalLLMPlatform';
import OpenAILLMPlatform from './OpenAILLMPlatform';
import Config from '../../core/Config';
import History from '../../core/History';
import Profiler from '../../core/Profiler';
import DataSourceItem from '../../entities/data-sources/origin/DataSourceItem';
import UnsupportedError from '../../entities/error-handling/UnsupportedError';
import { Tool } from '../../types/common';

type QueryOptions = {
	instructions?: string;
	history?: History;
	temperature?: number;
	outputTokens?: number;
	structuredResponse?: boolean;
	files?: DataSourceItem<string>[];
	tools?: Record<string, Tool>;
};

export default class LLM {
	public static readonly Configuration: {
		platform: 'azure' | 'openai' | 'google' | 'local';
		model?: string;
		embeddingPlatform: 'azure' | 'openai' | 'google';
		embeddingModel?: string;
		temperature?: number;
		outputTokens?: number;
	};
	
	public static async query(prompt: string, {
		instructions,
		history = new History(),
		temperature,
		outputTokens,
		structuredResponse,
		files,
	}: QueryOptions): Promise<string> {
		temperature ??= this.configuration.temperature ?? 0;
		outputTokens ??= this.configuration.outputTokens;
		
		await Profiler.run(async () => await history.ready, 'waiting for history to be ready');
		
		return this.platform.query(prompt, {
			instructions,
			temperature,
			outputTokens,
			history,
			structuredResponse,
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
		return this.embeddingPlatform.embeddingModel ?? this.configuration.embeddingModel;
	}
	
	public static get supportedMimeTypes(): Set<string> {
		return this.getPlatformClass(this.configuration.platform).supportedMimeTypes;
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
	
	public static async upload(item: DataSourceItem): Promise<void> {
		return await this.platform.upload(item);
	}
	
	private static getPlatformClass(platform: string): ILLMPlatform {
		const mapping = {
			azure: AzureLLMPlatform,
			openai: OpenAILLMPlatform,
			google: GoogleLLMPlatform,
			local: LocalLLMPlatform,
		};
		
		const platformClass = mapping[platform];
		
		if (!platformClass) throw new UnsupportedError('LLM platform', platform, Object.keys(mapping));
		
		return platformClass;
	}
};
