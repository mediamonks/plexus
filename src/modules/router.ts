import fs from 'node:fs';
import mime from 'mime-types';
import CustomError from '../entities/error-handling/CustomError';
import ErrorHandler from '../entities/error-handling/ErrorHandler';
import config from '../utils/config';
import Debug from '../utils/Debug';
import Profiler from '../utils/Profiler';
import RequestContext from '../utils/RequestContext';
import { JsonObject, RequestPayload } from '../types/common';

const routes = config.get('routes', { includeRequest: false });

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
		await RequestContext.create({ payload }, async () => {
			ErrorHandler.initialize();
			
			let response: JsonObject;
			
			try {
				response = await fn(variables, payload) ?? 'OK';
			} catch (error) {
				ErrorHandler.log(error);
			}
			
			const error = ErrorHandler.get();
			
			response = {
				...response,
				error: error?.toString(),
				performance: Profiler.getReport(),
				debug: Debug.get(),
			};
			
			if (error) res.status(error instanceof CustomError ? error.status : 500);
			
			res.send(response);
		});
	} catch (error) {
		res.status(500);
		res.send({ error: error.toString() });
		throw error;
	}
}
