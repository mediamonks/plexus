const fs = require('node:fs');
const mime = require('mime-types');
const routes = require('../../config/routes.json');
const RequestContext = require('../utils/RequestContext');

function cors(req, res) {
	res.set('Access-Control-Allow-Origin', req.get('origin') ?? req.get('host') ?? '*');
	res.set('Access-Control-Allow-Credentials', 'true');
	
	const isPreflight = req.method === 'OPTIONS';
	
	if (isPreflight) {
		res.set('Access-Control-Allow-Methods', 'GET, POST');
		res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Api-Key');
		res.set('Access-Control-Max-Age', '3600');
		res.status(204).send('');
	}
	
	return isPreflight;
}

async function sendFile(filePath, res) {
	filePath = `public/${filePath}`;
	if (!fs.existsSync(filePath)) {
		res.status(404);
		res.send('NOT FOUND');
	}
	res.set('Content-Type', mime.lookup(filePath));
	res.send(fs.readFileSync(filePath).toString());
}

module.exports = async function router(req, res) {
	if (cors(req, res)) return;
	
	let { path } = req;
	let pattern;
	path = path.replace(/^\/(dev-)?api/, '');
	path = path.replace(/\/$/, '');
	
	if (!path) return await sendFile('openapi.yaml', res);
	
	const matchPath = Object.keys(routes).find(matchPath => {
		pattern = '^' + matchPath.replace(/\{[^}]+}/g, '([^/]+)') + '$';
		return (new RegExp(pattern)).test(path);
	});
	
	if (!matchPath) {
		res.status(404);
		res.send('NOT FOUND');
		return;
	}
	
	const varNames = Array.from(matchPath.matchAll(/\{([^}]+)}/g) ?? []).map(match => match[1]);
	let variables = {};
	if (varNames) {
		const [, ...varValues] = path.match(new RegExp(pattern));
		variables = varNames.reduce(
			(result, name, index) => ({ ...result, [name]: varValues[index] }),
			{}
		);
	}
	
	if (routes[matchPath].file) return await sendFile(routes[matchPath].file, res);
	
	const handler = routes[matchPath]?.methods?.[req.method.toLowerCase()]?.handler;
	const fn = require(`../handlers/${handler}.js`);
	
	try {
		const payload = req.method === 'POST' ? req.body : req.query;
		const response = await RequestContext.run({ payload }, () => fn(variables, payload)) ?? 'OK';
		res.send(response);
	} catch (error) {
		res.status(500);
		res.send(error.toString());
		throw error;
	}
}
