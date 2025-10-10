import Catalog from '../entities/catalog/Catalog';
import CustomError from '../entities/error-handling/CustomError';
import config from '../utils/config';
import History from '../utils/History';
import Profiler from '../utils/Profiler';
import RequestContext from '../utils/RequestContext';
import { JsonObject, RequestPayload } from '../types/common';

export default async (_: any, payload: any): Promise<{
	output: JsonObject;
	threadId: string;
	fields: JsonObject;
}> => {
	const output = {};
	
	let { threadId } = RequestContext.get('payload') as RequestPayload;
	
	History.create(threadId as string);
	
	const outputFields = config.get('output') as string[];
	
	if (!outputFields || !outputFields.length) throw new CustomError('No output specified');
	
	await Promise.all(outputFields.map(async outputField => {
		output[outputField] = await Profiler.run(() => Catalog.instance.get(outputField).toJSON(), `get value for "${outputField}"`);
	}));
	
	await History.instance.save(output);
	
	return {
		output,
		threadId: History.instance.threadId,
		fields: payload.fields,
	};
};
