import OpenAI from 'openai';
import DataSourceItem from '../../../entities/data-sources/origin/DataSourceItem';

export interface ContainerConfig {
	env: string[];
	cmd?: string[];
}

export default interface IHuggingFaceLLMPlatformImage {
	readonly imageName: string;
	readonly healthEndpoint: string;
	readonly cacheBindPath: string;
	
	getContainerConfig(): ContainerConfig;
	createUserContent(query: string, files: DataSourceItem<string, unknown>[]): Promise<string | OpenAI.Chat.Completions.ChatCompletionContentPart[]>;
}
