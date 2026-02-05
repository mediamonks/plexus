import { AsyncLocalStorage } from 'node:async_hooks';
import CustomError from '../entities/error-handling/CustomError';

type RequestState = Record<string, unknown>;

export default class RequestContext {
	private static _asyncLocalStorage: AsyncLocalStorage<RequestState>;
	
	public static create<T>(data: RequestState, fn: () => T): T {
		return this.asyncLocalStorage.run(data, fn);
	}
	
	public static get asyncLocalStorage(): AsyncLocalStorage<RequestState> {
		return this._asyncLocalStorage ??= new AsyncLocalStorage<RequestState>();
	}
	
	public static get store(): RequestState {
		const store = this.asyncLocalStorage.getStore();
		
		if (!store) throw new CustomError('RequestContext not yet created', 500);
		
		return store;
	}
	
	public static get(key: string, defaultValue?: unknown): unknown {
		return this.store[key] ??= defaultValue;
	}
	
	public static set(key: string, value: unknown): void {
		this.store[key] = value;
	}
	
	public static exists(): boolean {
		return !!this.asyncLocalStorage.getStore();
	}
}
