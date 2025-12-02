import { performance } from 'node:perf_hooks';

const DELAY = 1000;

export default class GoogleWorkspace {
	public static readonly SERVICE = {
		GOOGLE_DRIVE: 'drive',
		SHEETS: 'sheets',
	} as const;
	
	public static readonly OPERATION = {
		READ: 'read',
		WRITE: 'write',
	} as const;
	
	private static _lastRequest = {};
	private static _queue = {};
	private static _timeout = {}
	
	public static async quotaDelay(service: string = this.SERVICE.GOOGLE_DRIVE, operation: string = this.OPERATION.READ): Promise<void> {
		let lastRequest = this._lastRequest?.[service]?.[operation];
		while (lastRequest && performance.now() - lastRequest < DELAY) {
			await new Promise(resolve => setTimeout(resolve,  lastRequest + DELAY - performance.now()));
			lastRequest = this._lastRequest?.[service]?.[operation];
		}
		this._lastRequest[service] ??= {};
		this._lastRequest[service][operation] = performance.now();
	}
	
	private static async performOperation(service: string, operation: string): Promise<void> {
		if (this._timeout[service]?.[operation]) {
			clearTimeout(this._timeout[service][operation]);
			delete this._timeout[service][operation];
		}
		
		this._lastRequest[service] ??= {};
		this._lastRequest[service][operation] = performance.now();
		
		const { fn, resolve } = this._queue[service][operation].shift();
		resolve(await fn());
		
		this.processQueue(service, operation).then();
	}
	
	private static async processQueue(service: string = this.SERVICE.GOOGLE_DRIVE, operation: string = this.OPERATION.READ): Promise<void> {
		if (!this._queue[service]?.[operation] || !this._queue[service]?.[operation].length) return;
		
		const lastRequest = this._lastRequest?.[service]?.[operation];
		if (lastRequest && performance.now() - lastRequest < DELAY) {
			if (this._timeout[service]?.[operation]) return;
			this._timeout[service] ??= {};
			this._timeout[service][operation] = setTimeout(() => {
				this.performOperation(service, operation);
			}, lastRequest + DELAY - performance.now());
			return;
		}
		
		await this.performOperation(service, operation);
	}
	
	public static async enqueue(fn: () => Promise<any>, service: string = this.SERVICE.GOOGLE_DRIVE, operation: string = this.OPERATION.READ): Promise<any> {
		return new Promise(resolve => {
			this._queue[service] ??= {};
			this._queue[service][operation] ??= [];
			this._queue[service][operation].push({ fn, resolve });
			this.processQueue(service, operation);
		});
	}
};
