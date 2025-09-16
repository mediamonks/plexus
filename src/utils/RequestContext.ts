import { AsyncLocalStorage } from 'node:async_hooks';

type RequestState = Record<string, unknown>;

export default class RequestContext {
	private static readonly _localMock: RequestState = {};
	private static _asyncLocalStorage: AsyncLocalStorage<RequestState>;
	
	public static run<T>(data: RequestState, fn: () => T): T {
		return this.asyncLocalStorage.run(data, fn);
	}
	
	public static get asyncLocalStorage(): AsyncLocalStorage<RequestState> {
		return this._asyncLocalStorage ??= new AsyncLocalStorage<RequestState>();
	}
	
	public static get keys(): RequestState {
		return this.asyncLocalStorage.getStore() ?? this._localMock;
	}
	
	public static get(key: string, defaultValue?: unknown): unknown {
		return this.keys[key] ??= defaultValue;
	}
	
	public static set(key: string, value: unknown): void {
		this.keys[key] = value;
	}
}
