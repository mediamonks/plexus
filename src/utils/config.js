const Profiler = require('./Profiler');
const requestContext = require('./request-context');
const global = require('../../config/global.json');
const modules = ['agents', 'azure', 'catalog', 'data-sources', 'firestore', 'input-fields', 'lancedb', 'openai', 'storage', 'vertexai'];
let _config;

function getRequestConfig() {
	return requestContext.get()?.config ?? {};
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
	
	if (typeof value1 !== typeof value2) throw new Error(`Configuration conflict for "${key}"`);
	
	if (typeof value2 !== 'object') return value2;
	
	return { ...value1, ...value2 };
}

function get(name) {
	const staticConfig = getStaticConfig();
	const requestConfig = getRequestConfig();
	
	if (!name) return { ...staticConfig, ...requestConfig };
	
	const [module, key] = name.split(/[.\/]/);
	
	if (!key) {
		const configKey = module;
		const staticValue = staticConfig[configKey];
		const requestValue = requestConfig[configKey];
		const value = merge(configKey, staticValue, requestValue);
		
		return typeof value !== 'object' ? value : merge(configKey, global, value);
	}
	
	if (requestConfig[module]?.[key] !== undefined) return requestConfig[module]?.[key];
	
	if (requestConfig[key] === undefined && staticConfig[module][key] === undefined)
		return staticConfig[key];
		
	if (requestConfig[key] === staticConfig[module][key])
		return requestConfig[key];
		
	throw new Error(`Configuration conflict for "${module}/${key}"`);
}

function set(name, value) {
	getRequestConfig()[name] = value;
}

module.exports = { get, set };
