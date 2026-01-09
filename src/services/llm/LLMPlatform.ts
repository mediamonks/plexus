import Config from '../../core/Config';
import Configuration from '../../types/Configuration';
import AzureLLMPlatform from './AzureLLMPlatform';
import GoogleLLMPlatform from './GoogleLLMPlatform';
import OpenAILLMPlatform from './OpenAILLMPlatform';
import LocalLLMPlatform from './LocalLLMPlatform';

export default abstract class LLMPlatform {
	static readonly Configuration: typeof AzureLLMPlatform['Configuration']
			| typeof GoogleLLMPlatform['Configuration']
			| typeof OpenAILLMPlatform['Configuration']
			| typeof LocalLLMPlatform['Configuration'];
	
	protected static readonly configModuleName: 'azure' | 'genai' | 'local-llm' | 'openai';
	
	protected static get configuration(): (typeof this)['Configuration'] {
		return Config.get(this.configModuleName, { includeGlobal: true });
	}
	
	protected static get llmConfiguration(): Configuration['llm'] {
		return Config.get('llm');
	}
	
	public static get outputTokens(): number | undefined {
		return this.configuration.outputTokens ?? this.llmConfiguration?.outputTokens;
	}
	
	public static get model(): string {
		return this.configuration.model ?? this.llmConfiguration?.model;
	}
	
	public static get embeddingModel(): string {
		return this.configuration['embeddingModel'] ?? this.llmConfiguration?.embeddingModel;
	}
}
