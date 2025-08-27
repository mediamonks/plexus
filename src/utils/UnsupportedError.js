module.exports = class UnsupportedError extends Error {
	constructor(name, value, mapping) {
		let message = `Unsupported ${name} "${value}"`;
		if (mapping) message += `. Must be one of: ${Object.keys(mapping).join(', ')}`;
		super(message);
		this.name = 'UnsupportedError';
	}
};
