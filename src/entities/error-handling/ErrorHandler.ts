import RequestContext from '../../core/RequestContext';

export default class ErrorHandler {
	private static initialized = false;
	
	private static get _log(): Error[] {
		return RequestContext.get('errors', []) as Error[];
	}
	
	public static initialize() {
		if (process.env.NODE_ENV === 'dev') return;
		
		if (this.initialized) return;
		
		process.on('uncaughtException', (error: Error) => {
			this.log(error);
		});
		
		process.on('unhandledRejection', (reason: Error | string) => {
			const error = reason instanceof Error ? reason : new Error(reason);
			this.log(error);
		});
		
		this.initialized = true;
	}
	
	public static log(error: Error) {
		this._log.push(error);
		console.error(error);
	}
	
	public static getAll(): Error[] {
		return this._log;
	}
	
	public static get(): Error | undefined {
		return this._log[this._log.length - 1];
	}
};
