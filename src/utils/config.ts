import { createRequire } from 'node:module';
import RequestContext from './RequestContext';
import global from '../../config/global.json';
import { Configuration, JsonField, RequestPayload } from '../types/common';

const require = createRequire(import.meta.url);
const modules = ['agents', 'azure', 'catalog', 'data-sources', 'firestore', 'input-fields', 'lancedb', 'openai', 'routes', 'storage', 'vertexai'];
let _config: Configuration;

function getRequestConfig(): Configuration {
	return (RequestContext.keys.payload as RequestPayload)?.config ?? {};
}

function createStaticConfig(): any {
	const config = { ...global };
	for (const module of modules) {
		config[module] = require(`../../config/${module}.json`);
		if (module in global) {
			if (typeof global[module] === 'object' && typeof config[module] === 'object') config[module] = { ...config[module], ...global[module] };
			else throw new Error(`Configuration conflict: module "${module}" and global key "${module}"`);
		}
	}
	return config;
}

function getStaticConfig(): any {
	return _config ??= createStaticConfig();
}

function merge(key: string, value1: any, value2: any): any {
	if (value2 === undefined) return value1;
	if (value1 === undefined) return value2;
	
	if (typeof value1 !== typeof value2) throw new Error(`Configuration conflict for "${key}"`);
	
	if (typeof value2 !== 'object') return value2;
	
	return { ...value1, ...value2 };
}

// TODO use flag to determine whether global config should be included
function get(name?: string, includeGlobal: boolean = false): JsonField {
	//TODO this whole function needs refactoring based on all possible use-cases
	const staticConfig = getStaticConfig();
	const requestConfig = getRequestConfig();
	
	if (!name) return { ...staticConfig, ...requestConfig };
	
	const [module, key] = name.split(/[.\/]/);
	
	if (!key) {
		const configKey = module;
		const staticValue = staticConfig[configKey];
		const requestValue = requestConfig[configKey];
		const value = merge(configKey, staticValue, requestValue);
		
		return includeGlobal && typeof value === 'object' && !(value instanceof Array) ? merge(configKey, global, value) : value;
	}
	
	if (requestConfig[module]?.[key] !== undefined) return requestConfig[module]?.[key];
	
	if (staticConfig[module]?.[key] !== undefined) return staticConfig[module]?.[key];
	
	if (requestConfig[key] === undefined && staticConfig[module][key] === undefined)
		return staticConfig[key];
		
	if (requestConfig[key] === staticConfig[module][key])
		return requestConfig[key];
		
	throw new Error(`Configuration conflict for "${module}/${key}"`);
}

export default { get };
