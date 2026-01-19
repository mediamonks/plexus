import OpenAI from 'openai';
import DataSourceItem from '../../../entities/data-sources/origin/DataSourceItem';

export type ContainerOptions = {
	env: string[];
	cmd?: string[];
}

export type ContainerConfiguration = {
	model: string;
	visionProjector?: string;
	contextSize: number;
};

export default interface ILocalLLMPlatformImage {
	readonly imageName: string;
	readonly healthEndpoint: string;
	readonly cacheBindPath: string;
	
	getContainerOptions(configuration: ContainerConfiguration): ContainerOptions;
	createUserContent(query: string, files: DataSourceItem[]): Promise<string | OpenAI.Chat.Completions.ChatCompletionContentPart[]>;
}
