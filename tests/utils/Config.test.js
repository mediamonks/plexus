// Mock RequestContext
const mockRequestContext = {
	store: undefined,
};

jest.mock('../../src/core/RequestContext', () => mockRequestContext);

// Mock global.json
jest.mock('../../config/global.json', () => ({
	projectId: 'static-global-projectId',
	location: 'static-global-location',
	platform: 'static-global-platform',
}), { virtual: true });

// Mock module configs
jest.mock('../../config/modules/genai.json', () => ({
	model: 'static-genai-model',
	embeddingModel: 'static-genai-embeddingModel',
	apiKey: 'static-genai-apiKey',
	projectId: 'static-genai-projectId',
}), { virtual: true });

jest.mock('../../config/modules/azure.json', () => ({
	deploymentName: 'static-azure-deploymentName',
	baseUrl: 'static-azure-baseUrl',
}), { virtual: true });

// Mock other module configs to return empty objects
const mockModules = ['agents', 'catalog', 'data-sources', 'drive', 'firestore', 'input-fields', 'lancedb', 'llm', 'openai', 'routes', 'storage'];
mockModules.forEach(module => {
	jest.mock(`../../config/${module}.json`, () => ({}), { virtual: true });
});

const Config = require('../../src/core/Config').default;
const CustomError = require('../../src/entities/error-handling/CustomError').default;

describe('Config', () => {
	beforeEach(() => {
		// Clear the static config cache before each test
		Config._staticConfig = undefined;
		
		// Reset RequestContext mock
		mockRequestContext.store = undefined;
	});

	describe('get() - without request context', () => {
		it('should return the full merged config when no name is provided', () => {
			const result = Config.get();
			
			expect(result).toMatchObject({
				projectId: 'static-global-projectId',
				location: 'static-global-location',
				platform: 'static-global-platform',
				genai: {
					model: 'static-genai-model',
					embeddingModel: 'static-genai-embeddingModel',
					apiKey: 'static-genai-apiKey',
				},
				azure: {
					deploymentName: 'static-azure-deploymentName',
					baseUrl: 'static-azure-baseUrl',
				},
			});
		});

		it('should get a top-level config value by key', () => {
			expect(Config.get('projectId')).toBe('static-global-projectId');
			expect(Config.get('location')).toBe('static-global-location');
		});

		it('should get a module config by module name', () => {
			const genaiConfig = Config.get('genai');
			expect(genaiConfig).toEqual({
				model: 'static-genai-model',
				embeddingModel: 'static-genai-embeddingModel',
				apiKey: 'static-genai-apiKey',
				projectId: 'static-genai-projectId',
			});
		});

		it('should get a specific module config value using dot notation', () => {
			expect(Config.get('genai.model')).toBe('static-genai-model');
			expect(Config.get('genai.embeddingModel')).toBe('static-genai-embeddingModel');
			expect(Config.get('azure.deploymentName')).toBe('static-azure-deploymentName');
		});

		it('should get a specific module config value using slash notation', () => {
			expect(Config.get('genai/model')).toBe('static-genai-model');
			expect(Config.get('azure/baseUrl')).toBe('static-azure-baseUrl');
		});

		it('should return undefined for non-existent keys', () => {
			expect(Config.get('nonExistent')).toBeUndefined();
			expect(Config.get('genai.nonExistent')).toBeUndefined();
		});
	});

	describe('get() - with request context', () => {
		beforeEach(() => {
			// Mock RequestContext with request-specific config
			mockRequestContext.store = {
				payload: {
					config: {
						projectId: 'request-global-projectId',
						requestKey: 'request-value',
						genai: {
							model: 'request-genai-model',
						},
					},
				},
			};
		});

		it('should merge request config with static config', () => {
			const result = Config.get();
			
			expect(result).toMatchObject({
				projectId: 'request-global-projectId', // Overridden by request
				location: 'static-global-location', // From global
				requestKey: 'request-value', // From request only
				genai: {
					model: 'request-genai-model', // Overridden by request
					embeddingModel: 'static-genai-embeddingModel', // From static
					apiKey: 'static-genai-apiKey', // From static
				},
			});
		});

		it('should prioritize request config over static config for specific keys', () => {
			expect(Config.get('projectId')).toBe('request-global-projectId');
			expect(Config.get('genai.model')).toBe('request-genai-model');
		});

		it('should return request-only values', () => {
			expect(Config.get('requestKey')).toBe('request-value');
		});

		it('should respect includeRequest: false option', () => {
			const result = Config.get('projectId', { includeRequest: false });
			expect(result).toBe('static-global-projectId'); // Should return static value
		});

		it('should return full config without request data when includeRequest: false', () => {
			const result = Config.get(undefined, { includeRequest: false });
			expect(result.projectId).toBe('static-global-projectId');
			expect(result.requestKey).toBeUndefined();
		});
	});

	describe('get() - includeGlobal option', () => {
		it('should merge global config when includeGlobal: true for module configs', () => {
			const result = Config.get('genai', { includeGlobal: true });
			
			expect(result).toMatchObject({
				location: 'static-global-location',
				platform: 'static-global-platform',
				model: 'static-genai-model',
				embeddingModel: 'static-genai-embeddingModel',
				apiKey: 'static-genai-apiKey',
				projectId: 'static-genai-projectId',
			});
		});

		it('should not merge global config when includeGlobal: false', () => {
			const result = Config.get('genai', { includeGlobal: false });
			
			expect(result).toEqual({
				model: 'static-genai-model',
				embeddingModel: 'static-genai-embeddingModel',
				apiKey: 'static-genai-apiKey',
				projectId: 'static-genai-projectId',
			});
		});

		it('should not merge global config for array values', () => {
			// Mock a config with an array
			mockRequestContext.store = {
				payload: {
					config: {
						arrayKey: ['item1', 'item2'],
						genai: {
							arrayKey: ['item3', 'item4'],
						},
					},
				},
			};
			
			const result = Config.get('genai', { includeGlobal: true });
			expect(result).toEqual({
				location: 'static-global-location',
				platform: 'static-global-platform',
				model: 'static-genai-model',
				embeddingModel: 'static-genai-embeddingModel',
				apiKey: 'static-genai-apiKey',
				projectId: 'static-genai-projectId',
				arrayKey: ['item3', 'item4'],
			});
		});
		
		it('should throw an error when a key exists at the module level and the global level of the request config and is not the same value', () => {
			mockRequestContext.store = {
				payload: {
					config: {
						model: 'global-value',
						genai: {
							model: 'module-value',
						},
					},
				},
			};
			
			expect(() => Config.get('genai/model', { includeGlobal: true })).toThrow(CustomError);
		});
		
		it('should throw an error when a key exists at the module level and the global level of the static config and is not the same value', () => {
			Config._staticConfig = {
				model: 'global-value',
				genai: {
					model: 'module-value',
				},
			};
			
			expect(() => Config.get('genai/model', { includeGlobal: true })).toThrow(CustomError);
		});
		
		it('should throw an error when a key exists at the module level of the static config and the global level of the request config and is not the same value', () => {
			Config._staticConfig = {
				genai: {
					model: 'module-value',
				},
			};
			
			mockRequestContext.store = {
				payload: {
					config: {
						model: 'global-value',
					},
				},
			};
			
			expect(() => Config.get('genai/model', { includeGlobal: true })).toThrow(CustomError);
		});
		
		it('should not throw an error when a key exists at the module level of the static config and the global level of the request config and is the same value', () => {
			Config._staticConfig = {
				genai: {
					model: 'value',
				},
			};
			
			mockRequestContext.store = {
				payload: {
					config: {
						model: 'value',
					},
				},
			};
			
			expect(() => Config.get('genai/model', { includeGlobal: true })).not.toThrow(CustomError);
		});
	});

	describe('get() - error handling', () => {
		it('should throw CustomError for configuration type conflicts', () => {
			// Setup conflicting config
			mockRequestContext.store = {
				payload: {
					config: {
						platform: true,
					},
				},
			};
			
			expect(() => Config.get('platform')).toThrow(CustomError);
		});
		
	});

	describe('get() - edge cases', () => {
		it('should handle missing RequestContext gracefully', () => {
			mockRequestContext.store = undefined;
			
			const result = Config.get('projectId');
			expect(result).toBe('static-global-projectId');
		});

		it('should handle RequestContext without payload', () => {
			mockRequestContext.store = {};
			
			const result = Config.get('projectId');
			expect(result).toBe('static-global-projectId');
		});

		it('should handle RequestContext without config in payload', () => {
			mockRequestContext.store = {
				payload: {},
			};
			
			const result = Config.get('projectId');
			expect(result).toBe('static-global-projectId');
		});

		it('should handle empty module configs', () => {
			const result = Config.get('agents');
			expect(result).toEqual({});
		});

		it('should handle non-existent module configs gracefully', () => {
			// The loadModuleConfig method catches errors and returns {}
			const result = Config.get('nonExistentModule');
			expect(result).toBeUndefined();
		});
	});
});
