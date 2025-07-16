module.exports = class UnsupportedError extends Error {
	constructor(name, value, mapping) {
		const message = `Unsupported ${name}: "${value}". Must be one of ${Object.keys(mapping).join(', ')}`;
		super(message);
		this.name = 'UnsupportedError';
	}
};
