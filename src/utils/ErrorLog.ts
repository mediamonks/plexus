import RequestContext from './RequestContext';

export default class ErrorLog {
	private static get _log(): Error[] {
		return RequestContext.get('errors', []) as Error[];
	}
	
	public static log(error: Error) {
		this._log.push(error);
	}
	
	public static get(): Error[] {
		return this._log;
	}
	
	public static throw(error: Error): void {
		this.log(error);
		throw error;
	}
};
