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

	public static run<T>(fn: () => T, label?: string): T;
	public static run<T>(fn: () => T, args: any[], label?: string): T;

	public static run<T, K>(fn: () => T, argsOrLabel?: K[] | string, label?: string): T {
		if (typeof argsOrLabel === 'string') {
			label = argsOrLabel;
			argsOrLabel = [];
		}

		label = label ?? fn.name;
		
		const start = performance.now();
		const retval = fn.apply(null, argsOrLabel);

		if (retval instanceof Promise) retval.then(() => this.log(label, start));
		else this.log(label, start);

		return retval;
	}
}
