const fs = require('node:fs/promises');
const path = require('node:path');
const config = require('./config');
const RequestContext = require('./RequestContext');

module.exports = class Debug {
	static get _log() {
		return RequestContext.get('debug', []);
	}
	
	static _formatData(data) {
		switch (typeof data) {
			case 'string':
				if (data.length <= 100) return [data];
				return [data.substring(0, 99) + '…', data.length];
			case 'number':
			case 'boolean':
				return [data];
			default:
				return this._formatData(JSON.stringify(data));
		}
	}
	
	static log(message, topic) {
		this._log.push({ ts: Date.now(), type: 'message', topic, message });
		
		if (process.env.NODE_ENV !== 'dev') return;
		
		console.debug('[DEBUG]', topic && `[${topic}]`, message);
	}
	
	static dump(label, data) {
		this._log.push({ ts: Date.now(), type: 'dump', label, data });
		
		const dumpFilePath = path.join(config.get('tempPath'), 'dump');
		
		fs.mkdir(dumpFilePath, { recursive: true }).then(() =>
			fs.writeFile(path.join(dumpFilePath, `${label}.json`), JSON.stringify(data, null, 2))
		);
		
		if (process.env.NODE_ENV !== 'dev') return;
		
		console.debug('[DUMP]',`[${label}]`, ...this._formatData(data));
	}
	
	static get() {
		return this._log;
	}
};
