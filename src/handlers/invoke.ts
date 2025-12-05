import Catalog from '../entities/catalog/Catalog';
import CustomError from '../entities/error-handling/CustomError';
import Config from '../core/Config';
import History from '../core/History';
import Profiler from '../core/Profiler';
import { JsonObject, InvokePayload } from '../types/common';

export default async (_: void, payload: InvokePayload): Promise<{
	output: JsonObject;
	threadId: string;
	fields: JsonObject;
}> => {
	const output = {};
	
	let { threadId } = payload;
	
	History.create(threadId as string);
	
	const outputFields = Config.get('output') as string[];
	
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
