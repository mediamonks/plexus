import fs from 'node:fs';
import mime from 'mime-types';
import ErrorHandler from '../entities/error-handling/ErrorHandler';
import config from '../utils/config';
import RequestContext from '../utils/RequestContext';
import { RequestPayload } from '../types/common';
import CustomError from '../entities/error-handling/CustomError';

const routes = config.get('routes');

function cors(req: any, res: any): boolean {
	res.set('Access-Control-Allow-Origin', req.get('origin') ?? req.get('host') ?? '*');
	res.set('Access-Control-Allow-Credentials', 'true');
	
	const isPreflight = req.method === 'OPTIONS';
	
	if (isPreflight) {
		res.set('Access-Control-Allow-Methods', 'GET, POST');
		res.set('Access-Control-Allow-Headers', 'Contents-Type, Authorization, X-Api-Key');
		res.set('Access-Control-Max-Age', '3600');
		res.status(204).send('');
	}
	
	return isPreflight;
}

async function sendFile(filePath: string, res: any): Promise<void> {
	filePath = `public/${filePath}`;
	if (!fs.existsSync(filePath)) {
		res.status(404);
		res.send('NOT FOUND');
	}
	res.set('Content-Type', mime.lookup(filePath));
	res.send(fs.readFileSync(filePath).toString());
}

export default async function router(req: any, res: any): Promise<void> {
	try {
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
		const handlerModule = await import(`../handlers/${handler}`);
		const fn = handlerModule.default;
		
		const payload: RequestPayload = req.method === 'POST' ? req.body : req.query;
		await RequestContext.run({ payload }, async () => {
			ErrorHandler.initialize();
			
			let response = await fn(variables, payload) ?? 'OK';
			
			const error = ErrorHandler.get();
			if (error) {
				res.status(error instanceof CustomError ? error.status : 500);
				response = { ...response, error: error.toString() };
			}
			
			res.send(response);
		});
	} catch (error) {
		res.status(500);
		res.send({ error: error.toString() });
		throw error;
	}
}
