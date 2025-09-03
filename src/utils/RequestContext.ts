import { AsyncLocalStorage } from 'node:async_hooks';

type RequestState = Record<string, unknown>;

export default class RequestContext {
	static _localMock: RequestState = {};
	static _asyncLocalStorage: AsyncLocalStorage<RequestState>;
	
	static run<T>(data: RequestState, fn: () => T): T {
		return this.asyncLocalStorage.run(data, fn);
	}
	
	static get asyncLocalStorage(): AsyncLocalStorage<RequestState> {
		return this._asyncLocalStorage ??= new AsyncLocalStorage<RequestState>();
	}
	
	static get keys(): RequestState {
		return this.asyncLocalStorage.getStore() ?? this._localMock;
	}
	
	static get(key: string, defaultValue?: unknown): unknown {
		return this.keys[key] ??= defaultValue;
	}
	
	static set(key: string, value: unknown): void {
		this.keys[key] = value;
	}
}
