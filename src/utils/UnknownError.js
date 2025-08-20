module.exports = class UnknownError extends Error {
	constructor(name, value, mapping) {
		const message = `Unknown ${name} "${value}". Must be one of: ${Object.keys(mapping).join(', ')}`;
		super(message);
		this.name = 'UnknownError';
	}
};
