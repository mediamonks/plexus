import IHuggingFaceLLMPlatformImage, { ContainerConfig } from './IHuggingFaceLLMPlatformImage';
import HuggingFaceLLMPlatform from '../HuggingFaceLLMPlatform';
import DataSourceItem from '../../../entities/data-sources/origin/DataSourceItem';

export default class HuggingFaceLLMPlatformImageLlamaCpp implements IHuggingFaceLLMPlatformImage {
	public readonly imageName = 'ghcr.io/ggml-org/llama.cpp:server-cuda';
	public readonly cacheBindPath = '/root/.cache/llama.cpp';
	public readonly healthEndpoint = 'health';
	
	public getContainerConfig(): ContainerConfig {
		const { model } = HuggingFaceLLMPlatform.configuration;
		const contextSize = HuggingFaceLLMPlatform.contextSize;
		const [hfRepo, hfFile] = model.includes('/') && model.endsWith('.gguf')
			? [model.substring(0, model.lastIndexOf('/')), model.split('/').pop()!]
			: [model, undefined];
		
		return {
			env: [`MODEL=${model}`],
			cmd: [
				'--hf-repo', hfRepo,
				...(hfFile ? ['--hf-file', hfFile] : []),
				'--ctx-size', String(contextSize),
				'--n-gpu-layers', '99',
				'--host', '0.0.0.0',
				'--port', '80',
			],
		};
	}
	
	public async createUserContent(query: string, files: DataSourceItem<string, unknown>[]): Promise<string> {
		const fileParts = await HuggingFaceLLMPlatform.createFileParts(files);
		const documents = fileParts
			.map((part, i) => part.type === 'text' ? `--- DOCUMENT ${i + 1} START ---\n${part.text}\n--- DOCUMENT ${i + 1} END ---` : '')
			.filter(Boolean);
		
		return [query, ...documents].join('\n\n');
	}
}
