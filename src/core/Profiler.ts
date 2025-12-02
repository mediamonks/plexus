import { performance } from 'node:perf_hooks';
import RequestContext from './RequestContext';

export type ProfilerLogEntry = Record<string, number>;

export default class Profiler {
	public static getReport(): ProfilerLogEntry[] {
		return this._log;
	}

	private static get _log(): ProfilerLogEntry[] {
		return RequestContext.get('profiler', []) as ProfilerLogEntry[];
	}
	
	private static log(label: string, start: number): void {
		const ms = performance.now() - start;
		this._log.push({ [label]: ms });
		if (process.env.NODE_ENV === 'dev') console.debug('[PERF]', `[${label}]`, ms);
	}

	public static async run<TReturnValue>(fn: () => TReturnValue, label?: string): Promise<TReturnValue>;
	public static async run<TReturnValue>(fn: () => TReturnValue, args: any[], label?: string): Promise<TReturnValue>;
	public static async run<TReturnValue>(fn: () => TReturnValue, argsOrLabel?: any[] | string, label?: string): Promise<TReturnValue> {
		if (typeof argsOrLabel === 'string') {
			label = argsOrLabel;
			argsOrLabel = [];
		}

		label = label ?? fn.name;
		
		const start = performance.now();
		const retval = await fn.apply(null, argsOrLabel);

		this.log(label, start);

		return retval;
	}
}
