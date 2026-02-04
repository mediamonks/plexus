const YAML = require('yaml');
const packageJson = require('../package.json');
const routes = require('../config/routes.json');
const deploy = require('../config/deploy.json');

const [env, target] = process.argv.slice(2);

if (!deploy[env]) throw new Error(`Error: Invalid environment. Valid values: ${Object.keys(deploy).join(', ')}`);

const includeOptions = target === 'gateway';
const includeSelf = target === 'gateway';
const addOperationIds = target === 'gateway';
const apiEndpoint = `https://${deploy[env].region}-${deploy[env].project}.cloudfunctions.net${deploy[env].apiBaseUrl}`;
const endpointBaseUrl = deploy[env].apiBaseUrl;
const PREFLIGHT_DEF = {
	corsPreflightResponse: {
		description: 'CORS preflight response',
		headers: {
			'Access-Control-Allow-Origin': {
				type: 'string',
				description: 'Allowed origin for CORS'
			},
			'Access-Control-Allow-Methods': {
				type: 'string',
				description: 'Allowed methods for CORS'
			},
			'Access-Control-Allow-Headers': {
				type: 'string',
				description: 'Allowed headers for CORS'
			},
			'Access-Control-Allow-Credentials': {
				type: 'boolean',
				description: 'Whether to allow credentials for CORS'
			},
			'Access-Control-Max-Age': {
				type: 'integer',
				description: 'Max age for caching the preflight response in seconds'
			}
		}
	}
};

function getParameters(methodConfig) {
	const parameters = [];
	
	if (methodConfig.payload) {
		let required = [];
		for (const key in methodConfig.payload) {
			if (!methodConfig.payload[key].required) continue;
			required.push(key);
			delete methodConfig.payload[key].required;
		}
		if (!required.length) required = undefined;
		
		parameters.push({
			name: 'body',
			in: 'body',
			required: true,
			schema: {
				type: 'object',
				required,
				properties: methodConfig.payload
			}
		});
	}
	
	return parameters.length ? parameters : undefined;
}

function getResponse(methodConfig) {
	return {
		200: {
			description: 'Successful response',
			schema: methodConfig.response
		}
	};
}

function getMethods(routeConfig) {
	const methods = {};
	
	if (!routeConfig.methods) return methods;
	
	for (const method in routeConfig.methods) {
		const methodConfig = routeConfig.methods[method];
		
		if (methodConfig.hidden) continue;
		
		methods[method] = {
			summary: methodConfig.summary,
			description: methodConfig.description,
			parameters: getParameters(methodConfig),
			responses: getResponse(methodConfig),
			security: [{ api_key: [] }]
		};
	}
	
	return methods;
}

function getOptions(endpoint) {
	return {
		summary: `CORS preflight for ${endpoint}`,
		responses: {
			204: {
				'$ref': '#/responses/corsPreflightResponse'
			}
		},
		security: []
	};
}

function getPaths(routes) {
	const paths = {};
	
	for (const route in routes) {
		const routeConfig = routes[route];
		
		if (routeConfig.hidden) continue;
		
		let parameters;
		if (routeConfig.parameters) {
			const parameterNames = Object.keys(routeConfig.parameters);
			parameters = parameterNames.map(name => ({ ...routeConfig.parameters[name], name, in: 'path', required: true }));
		}
		
		const methods = getMethods(routeConfig);
		
		if (includeOptions) methods.options = getOptions(route);
		
		if (addOperationIds) {
			for (const method in methods) {
				methods[method].operationId = `${method.toUpperCase()} ${route}`;
			}
		}
		
		paths[`${endpointBaseUrl}${route}`] = {
			parameters,
			...methods
		};
	}
	
	return paths;
}

if (includeSelf) routes[''] = {
	methods: {
		get: {
			summary: 'The API definition'
		}
	}
};

const paths = getPaths(routes);

const def = {
	swagger: '2.0',
	info: {
		title: packageJson.name,
		description: packageJson.description,
		version: packageJson.version
	},
	schemes: [
		'https'
	],
	produces: [
		'application/json'
	],
	'x-google-backend': {
		address: apiEndpoint,
		path_translation: 'APPEND_PATH_TO_ADDRESS',
		protocol: 'h2',
		deadline: 300,
		jwt_audience: apiEndpoint
	},
	paths,
	responses: includeOptions ? PREFLIGHT_DEF : undefined,
	securityDefinitions: {
		api_key: {
			type: 'apiKey',
			name: 'x-api-key',
			in: 'header'
		}
	}
};

console.log(YAML.stringify(def));
