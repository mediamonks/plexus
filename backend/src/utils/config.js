const requestContext = require('../utils/request-context');
const config = require('../../config/global.json');

function getRequestConfig() {
	return requestContext.get()?.config ?? {};
}

function get(name) {
	if (name) return getRequestConfig()[name] ?? config[name];
	
	return {
		...config,
		...getRequestConfig()
	};
}

function set(name, value) {
	getRequestConfig()[name] = value;
}

module.exports = { get, set };
