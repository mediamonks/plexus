import OpenAI from 'openai';
import ILocalLLMPlatformImage, { ContainerConfiguration, ContainerOptions } from './ILocalLLMPlatformImage';
import LocalLLMPlatform from '../LocalLLMPlatform';
import DataSourceItem from '../../../entities/data-sources/origin/DataSourceItem';

export default class LocalLLMPlatformImageTGI implements ILocalLLMPlatformImage {
	public readonly imageName = 'ghcr.io/local/text-generation-inference:2.4.0';
	public readonly cacheBindPath = '/data';
	public readonly healthEndpoint = 'health';
	
	public getContainerOptions({ model, contextSize }: ContainerConfiguration): ContainerOptions {
		const quantization = model.toLowerCase().includes('-awq') ? 'awq'
			: model.toLowerCase().includes('-gptq') ? 'gptq'
			: 'bitsandbytes-nf4';
		
		return {
			env: [
				`MODEL_ID=${model}`,
				`QUANTIZE=${quantization}`,
				`MAX_INPUT_LENGTH=${contextSize - 1000}`,
				`MAX_TOTAL_TOKENS=${contextSize}`,
				`MAX_BATCH_PREFILL_TOKENS=${contextSize - 1000}`,
				'MAX_BATCH_SIZE=1'
			],
		};
	}
	
	public async createUserContent(query: string, files: DataSourceItem<string>[]): Promise<OpenAI.Chat.Completions.ChatCompletionContentPart[]> {
		const fileParts = await LocalLLMPlatform.createFileParts(files);
		
		return [{ type: 'text', text: query }, ...fileParts];
	}
}
