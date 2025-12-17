import OpenAI from 'openai';
import ILocalLLMPlatformImage, { ContainerConfig } from './ILocalLLMPlatformImage';
import LocalLLMPlatform from '../LocalLLMPlatform';
import DataSourceItem from '../../../entities/data-sources/origin/DataSourceItem';

export default class LocalLLMPlatformImageLlamaCpp implements ILocalLLMPlatformImage {
	public readonly imageName = 'ghcr.io/ggml-org/llama.cpp:server-cuda';
	public readonly cacheBindPath = '/root/.cache/llama.cpp';
	public readonly healthEndpoint = 'health';
	
	public getContainerConfig(): ContainerConfig {
		const { model, visionProjector } = LocalLLMPlatform.configuration;
		const contextSize = LocalLLMPlatform.contextSize;
		const [hfRepo, hfFile] = model.includes('/') && model.endsWith('.gguf')
			? [model.substring(0, model.lastIndexOf('/')), model.split('/').pop()!]
			: [model, undefined];
		const mmproj = visionProjector ? `hf://${hfRepo}/${visionProjector}` : undefined;
		
		return {
			env: [`MODEL=${model}`, ...(mmproj ? [`MMPROJ=${mmproj}`] : [])],
			cmd: [
				'--hf-repo', hfRepo,
				...(hfFile ? ['--hf-file', hfFile] : []),
				...(mmproj ? ['--mmproj', mmproj] : []),
				'--ctx-size', String(contextSize),
				'--n-gpu-layers', '99',
				'--host', '0.0.0.0',
				'--port', '80',
			],
		};
	}
	
	public async createUserContent(query: string, files: DataSourceItem<string, unknown>[]): Promise<OpenAI.Chat.Completions.ChatCompletionContentPart[]> {
		const fileParts = await LocalLLMPlatform.createFileParts(files);
		
		const textParts = fileParts.filter((part): part is OpenAI.Chat.Completions.ChatCompletionContentPartText => part.type === 'text');
		const imageParts = fileParts.filter((part): part is OpenAI.Chat.Completions.ChatCompletionContentPartImage => part.type === 'image_url');
		
		const documents = textParts.map((part, i) => `--- DOCUMENT ${i + 1} START ---\n${part.text}\n--- DOCUMENT ${i + 1} END ---`);
		const textContent = [query, ...documents].join('\n\n');
		
		return [{ type: 'text', text: textContent }, ...imageParts];
	}
}
