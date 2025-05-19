const { performance } = require('node:perf_hooks');
const requestContext = require('./request-context');

class Profiler {
	static getReport() {
		return this._log;
	}

	static get _log() {
		const rc = requestContext.get();
		if (!rc) return [];
		return rc._perf ??= [];
	}

	static async run(fn, args = [], label) {
		if (typeof args === 'string') {
			label = args;
			args = [];
		}
		const start = performance.now();
		label = label ?? fn.name;
		const retval = await fn.apply(null, args);
		const ms = performance.now() - start;
		this._log.push({ [label]: ms });
		if (process.env.NODE_ENV === 'dev') console.debug('[PERF]', label, ms);
		return retval;
	}
}

module.exports = Profiler;
