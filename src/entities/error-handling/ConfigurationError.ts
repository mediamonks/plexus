export default class ConfigurationError extends Error {
	constructor(message?: string, public readonly status = 400) {
		super(message);
	}
};
