import RequestContext from './RequestContext';
import CustomError from '../entities/error-handling/CustomError';
import { JsonField, JsonObject, RequestPayload } from '../types/common';
import global from '../../config/global.json';

const MODULES = [
	'agents',
	'azure',
	'catalog',
	'data-sources',
	'drive',
	'firestore',
	'genai', // TODO rename to google, nest under llm?
	'input-fields',
	'lancedb',
	'llm',
	'openai',
	'storage',
];

export default class Config {
	static _staticConfig: JsonObject;
	static _staticGlobalConfig: JsonObject;
	
	public static get(name?: string, { includeGlobal = false, includeRequest = true }: { includeGlobal?: boolean, includeRequest?: boolean } = {}) {
		try {
			let result = includeRequest ? this.merge(this.staticConfig, this.requestConfig) : this.staticConfig;
			
			if (!name) return result;
			
			const keys = name.split(/[.\/]/);
			
			let module = MODULES.includes(keys[0]) && keys.shift();
			
			if (module) {
				result = result[module];
				
				if (includeGlobal) {
					const globalConfig = includeRequest ? this.merge(this.staticGlobalConfig, this.requestGlobalConfig) : this.staticGlobalConfig;
					
					result = this.merge(globalConfig, result, true);
				}
			}
			
			while (keys.length) {
				const key = keys.shift();
				result = result[key];
			}
			
			return result;
		} catch (error) {
			throw new CustomError(`Configuration conflict in key "${name}": ${error}`);
		}
	}
	
	private static get staticConfig() {
		if (this._staticConfig) return this._staticConfig;
		
		const config = { ...global };
		for (const module of MODULES) {
			config[module] = this.loadModuleConfig(module);
			if (module in global) {
				if (typeof global[module] === 'object' && typeof config[module] === 'object') config[module] = { ...config[module], ...global[module] };
				else throw new CustomError(`Configuration conflict: module "${module}" and global key "${module}"`);
			}
		}
		
		return this._staticConfig = config;
	}
	
	private static get requestConfig(): JsonObject {
		return (RequestContext.store?.payload as RequestPayload)?.config ?? {} as JsonObject;
	}
	
	private static get staticGlobalConfig(): JsonObject {
		if (this._staticGlobalConfig) return this._staticGlobalConfig;
		
		return this._staticGlobalConfig = this.globalOnly(this.staticConfig);
	}
	
	private static get requestGlobalConfig(): JsonObject {
		return this.globalOnly(this.requestConfig);
	}
	
	private static loadModuleConfig(module: string): JsonObject {
		try {
			return require(`../../config/modules/${module}.json`);
		} catch {
			return {};
		}
	}
	
	private static merge(value1: JsonField, value2: JsonField, strict: boolean = false): JsonField {
		if (value2 === undefined) return value1;
		if (value1 === undefined) return value2;
		
		// Type mismatch check
		if (typeof value1 !== typeof value2) throw new CustomError('Keys not of same type');
		
		// Non-object types: overwrite with value2
		if (typeof value1 !== 'object') {
			if (strict && value1 !== value2) throw new CustomError('Module-level key conflicts with global key');
			return value2;
		}
		
		// Arrays: overwrite (don't merge)
		const isArray1 = value1 instanceof Array;
		const isArray2 = value2 instanceof Array;
		
		if (isArray1 !== isArray2) throw new CustomError('Keys not of same type');
		if (isArray1) {
			if (strict) throw new CustomError('Module-level key conflicts with global key');
			return value2;
		}
		
		// Deep merge objects recursively
		const result: JsonObject = { ...value1 as JsonObject };
		
		for (const key in value2 as JsonObject) {
			result[key] = this.merge(value1[key], value2[key], strict);
		}
		
		return result;
	}
	
	private static globalOnly(config: JsonObject): JsonObject {
		const result: JsonObject = {};
		for (const key in config) {
			if (MODULES.includes(key)) continue;
			result[key] = config[key];
		}
		return result;
	}
};
