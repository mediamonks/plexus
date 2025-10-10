export default class CustomError extends Error {
	constructor(message?: string, public readonly status = 400) {
		super(message);
	}
}
