const { performance } = require('node:perf_hooks');
const RequestContext = require('./RequestContext');

class Profiler {
	static getReport() {
		return this._log;
	}

	static get _log() {
		return RequestContext.get('profiler', []);
	}
	
	static log(label, start) {
		const ms = performance.now() - start;
		this._log.push({ [label]: ms });
		if (process.env.NODE_ENV === 'dev') console.debug('[PERF]', `[${label}]`, ms);
	}

	static run(fn, args = [], label) {
		if (typeof args === 'string') {
			label = args;
			args = [];
		}
		label = label ?? fn.name;
		const start = performance.now();
		const retval = fn.apply(null, args);
		if (retval instanceof Promise) retval.then(() => this.log(label, start));
		else this.log(label, start);
		return retval;
	}
}

module.exports = Profiler;
