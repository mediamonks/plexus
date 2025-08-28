import invoke from '../modules/invoke';
import Profiler from '../utils/Profiler';
import Debug from '../utils/Debug';
import History from '../utils/History';

export default async (_: any, payload: any): Promise<{
	error: Error | undefined;
	output: any;
	threadId: string;
	payload: any;
	performance: any;
	debug: any;
}> => {
	let error: Error | undefined, output: any;
	
	try {
		output = await Profiler.run(invoke, 'total');
	} catch (err) {
		console.error(err);
		error = err;
	}
	
	return {
		error,
		output,
		threadId: History.instance.threadId,
		payload,
		performance: Profiler.getReport(),
		debug: Debug.get(),
	};
};
