const RequestContext = require('./RequestContext');
const global = require('../../config/global.json');
const modules = ['agents', 'azure', 'catalog', 'data-sources', 'firestore', 'input-fields', 'lancedb', 'openai', 'storage', 'vertexai'];
let _config;

function getRequestConfig() {
	return RequestContext.keys.payload?.config ?? {};
}

function createStaticConfig() {
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

function getStaticConfig() {
	return _config ??= createStaticConfig();
}

function merge(key, value1, value2) {
	if (value2 === undefined) return value1;
	if (value1 === undefined) return value2;
	
	if (typeof value1 !== typeof value2) throw new Error(`Configuration conflict for "${key}"`);
	
	if (typeof value2 !== 'object') return value2;
	
	return { ...value1, ...value2 };
}

// TODO use flag to determine whether global config should be included
function get(name, includeGlobal = false) {
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

module.exports = { get };
