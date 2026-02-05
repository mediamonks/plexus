import RequestContext from '../../core/RequestContext';

export default class ErrorHandler {
	private static _errors: Error[] = [];
	private static _initialized = false;
	
	private static get _log(): Error[] | null {
		return RequestContext.exists() ? RequestContext.get('errors', []) as Error[] : [];
	}
	
	public static initialize() {
		if (process.env.NODE_ENV === 'dev') return;
		
		if (this._initialized) return;
		
		process.on('uncaughtException', (error: Error) => {
			this.log(error);
		});
		
		process.on('unhandledRejection', (reason: Error | string) => {
			const error = reason instanceof Error ? reason : new Error(reason);
			this.log(error);
		});
		
		this._initialized = true;
	}
	
	public static log(error: Error) {
		console.error(error);
		
		if (RequestContext.exists()) {
			const errors = RequestContext.get('errors', []) as Error[];
			errors.push(error);
			RequestContext.set('errors', errors);
			return;
		}
		
		this._errors.push(error);
	}
	
	public static getAll(): Error[] {
		return [ ...this._log, ...this._errors ];
	}
	
	public static get(): Error | undefined {
		const errors = this.getAll();
		return errors[errors.length - 1];
	}
};
