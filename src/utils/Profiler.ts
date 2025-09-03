import { performance } from 'node:perf_hooks';
import RequestContext from './RequestContext';

type LogEntry = Record<string, number>;

export default class Profiler {
	static getReport(): LogEntry[] {
		return this._log;
	}

	static get _log(): LogEntry[] {
		return RequestContext.get('profiler', []) as LogEntry[];
	}
	
	static log(label: string, start: number): void {
		const ms = performance.now() - start;
		this._log.push({ [label]: ms });
		if (process.env.NODE_ENV === 'dev') console.debug('[PERF]', `[${label}]`, ms);
	}

	static run<T>(fn: () => T, label?: string): T;
	static run<T>(fn: () => T, args: any[], label?: string): T;

	static run<T, K>(fn: () => T, argsOrLabel?: K[] | string, label?: string): T {
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
