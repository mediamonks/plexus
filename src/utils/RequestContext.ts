import { AsyncLocalStorage } from 'node:async_hooks';

class RequestContext {
	static _localMock = {};
	static _asyncLocalStorage;
	
	static run(data: any, fn: () => any): any {
		return this.asyncLocalStorage.run(data, fn);
	}
	
	static get asyncLocalStorage() {
		return this._asyncLocalStorage ??= new AsyncLocalStorage();
	}
	
	static get keys() {
		return this.asyncLocalStorage.getStore() ?? this._localMock;
	}
	
	static get(key: string, defaultValue?: any): any {
		return this.keys[key] ??= defaultValue;
	}
	
	static set(key: string, value: any): any {
		this.keys[key] = value;
	}
}

export default RequestContext;
