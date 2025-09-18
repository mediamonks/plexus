import Catalog from '../entities/catalog/Catalog';
import config from '../utils/config';
import Debug, { DebugLogEntry } from '../utils/Debug';
import ErrorLog from '../utils/ErrorLog';
import History from '../utils/History';
import Profiler, { ProfilerLogEntry } from '../utils/Profiler';
import RequestContext from '../utils/RequestContext';
import { JsonObject, RequestPayload } from '../types/common';

export default async (_: any, payload: any): Promise<{
	error: string | undefined;
	output: JsonObject;
	threadId: string;
	fields: JsonObject;
	performance: ProfilerLogEntry[];
	debug: DebugLogEntry[];
}> => {
	const output = {};
	
	try {
		let { threadId } = RequestContext.get('payload') as RequestPayload;
		
		History.create(threadId as string);
		
		const outputFields = config.get('output') as string[];
		
		if (!outputFields || !outputFields.length) ErrorLog.throw(new Error('No output specified'));
		
		await Promise.all(outputFields.map(async outputField => {
			output[outputField] = await Profiler.run(() => Catalog.instance.get(outputField).getValue(), `get value for "${outputField}"`);
		}));
		
		await History.instance.save(output);
	} catch (err) {
		ErrorLog.log(err);
	}
	
	return {
		error: ErrorLog.get().pop()?.toString(),
		output,
		threadId: History.instance.threadId,
		fields: payload.fields,
		performance: Profiler.getReport(),
		debug: Debug.get(),
	};
};
