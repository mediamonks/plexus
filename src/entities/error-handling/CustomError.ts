export default class CustomError extends Error {
	constructor(message?: string, public readonly status = 400) {
		super(message);
		this.name = 'Error';
		Object.setPrototypeOf(this, new.target.prototype);
		Error.captureStackTrace?.(this, CustomError);
	}
};
