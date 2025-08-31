import { AsyncLocalStorage } from 'node:async_hooks';

export default class RequestContext {
	static _localMock: Record<string, unknown> = {};
	static _asyncLocalStorage: AsyncLocalStorage<Record<string, unknown>>;
	
	static run<T>(data: Record<string, unknown>, fn: () => T): T {
		return this.asyncLocalStorage.run(data, fn);
	}
	
	static get asyncLocalStorage(): AsyncLocalStorage<Record<string, unknown>> {
		return this._asyncLocalStorage ??= new AsyncLocalStorage<Record<string, unknown>>();
	}
	
	static get keys(): Record<string, unknown> {
		return this.asyncLocalStorage.getStore() ?? this._localMock;
	}
	
	static get(key: string, defaultValue?: unknown): unknown {
		return this.keys[key] ??= defaultValue;
	}
	
	static set(key: string, value: unknown): void {
		this.keys[key] = value;
	}
}
