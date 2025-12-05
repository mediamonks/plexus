import fs from 'node:fs';
import mime from 'mime-types';
import { Request, Response } from '@google-cloud/functions-framework';
import Debug from './Debug';
import Profiler from './Profiler';
import RequestContext from './RequestContext';
import CustomError from '../entities/error-handling/CustomError';
import ErrorHandler from '../entities/error-handling/ErrorHandler';
import { JsonField, JsonObject, InvokePayload } from '../types/common';
import ROUTES from '../../config/routes.json';

type Handler = (variables: JsonObject, payload: InvokePayload) => Promise<JsonField | undefined>;

export default class Router {
	public static async handle(req: Request, res: Response): Promise<void> {
		try {
			this.setCorsHeaders(req, res);
			
			if (this.isPreflight(req)) {
				res.status(204).send('');
				return;
			}
			
			const path = this.getPath(req);
			
			if (!path) return await this.sendFile('openapi.yaml', res);
			
			const route = this.getRoute(path);
			
			if (!route) {
				res.status(404);
				res.send('NOT FOUND');
				return;
			}
			
			if (ROUTES[route].file) return await this.sendFile(ROUTES[route].file, res);
			
			const variables = this.getVariables(route, path);
			
			const handler = await this.getHandler(route, req);
			
			const payload = this.getPayload(req);
			
			await RequestContext.create({ payload }, async () => {
				ErrorHandler.initialize();
				
				let result: JsonField;
				
				try {
					result = (await handler(variables, payload)) ?? 'OK';
				} catch (error) {
					ErrorHandler.log(error);
				}
				
				const error = ErrorHandler.get();
				
				if (error) res.status(error instanceof CustomError ? error.status : 500);
				
				res.send({
					result,
					error: error?.toString(),
					performance: Profiler.getReport(),
					debug: Debug.get(),
				});
			});
		} catch (error) {
			res.status(500);
			res.send({ error: error.toString() });
			console.error(error);
		}
	}
	
	private static isPreflight(req: Request): boolean {
		return req.method === 'OPTIONS';
	}
	
	private static setCorsHeaders(req: Request, res: Response): void {
		res.set('Access-Control-Allow-Origin', req.get('origin') ?? req.get('host') ?? '*');
		res.set('Access-Control-Allow-Credentials', 'true');
		
		if (this.isPreflight(req)) {
			res.set('Access-Control-Allow-Methods', 'GET, POST');
			res.set('Access-Control-Allow-Headers', 'Contents-Type, Authorization, X-Api-Key');
			res.set('Access-Control-Max-Age', '3600');
		}
	}
	
	private static async sendFile(filePath: string, res: any): Promise<void> {
		filePath = `public/${filePath}`;
		if (!fs.existsSync(filePath)) {
			res.status(404);
			res.send('NOT FOUND');
			return;
		}
		res.set('Content-Type', mime.lookup(filePath));
		res.send(fs.readFileSync(filePath).toString());
	}
	
	private static getPath(req: Request): string {
		let { path } = req;
		path = path.replace(/^\/(dev-)?api/, ''); // TODO should be based on actual apiBaseUrl?
		return path.replace(/\/$/, '');
	}
	
	private static getRoute(path: string): string {
		return Object.keys(ROUTES).find(route => this.getRouteRegExp(route).test(path));
	}
	
	private static getVariables(route: string, path: string) {
		const varNames = Array.from(route.matchAll(/\{([^}]+)}/g) ?? []).map(match => match[1]);
		let variables = {};
		if (varNames) {
			const [, ...varValues] = path.match(this.getRouteRegExp(route));
			variables = varNames.reduce(
				(result, name, index) => ({ ...result, [name]: varValues[index] }),
				{}
			);
		}
		return variables;
	}
	
	private static getRouteRegExp(route: string) {
		const routeConfig = ROUTES[route];
		return routeConfig.regExp ??= new RegExp('^' + route.replace(/\{[^}]+}/g, '([^/]+)') + '$');
	}
	
	private static async getHandler(route: string, req: Request): Promise<Handler> {
		const handlerName = ROUTES[route]?.methods?.[req.method.toLowerCase()]?.handler;
		const handlerModule = await import(`../handlers/${handlerName}`);
		return handlerModule.default;
	}
	
	private static getPayload(req: Request): InvokePayload {
		return req.method === 'POST' ? req.body : req.query;
	}
}
