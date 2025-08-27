const { AsyncLocalStorage } = require('node:async_hooks');

class RequestContext {
	static _localMock = {};
	static _asyncLocalStorage;
	
	static run(data, fn) {
		return this.asyncLocalStorage.run(data, fn);
	}
	
	static get asyncLocalStorage() {
		return this._asyncLocalStorage ??= new AsyncLocalStorage();
	}
	
	static get keys() {
		return this.asyncLocalStorage.getStore() ?? this._localMock;
	}
	
	static get(key, defaultValue) {
		return this.keys[key] ??= defaultValue;
	}
	
	static set(key, value) {
		this.keys[key] = value;
	}
}

module.exports = RequestContext;
