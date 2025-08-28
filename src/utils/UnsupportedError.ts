export default class UnsupportedError extends Error {
	constructor(name: string, value: string, mapping?: Record<string, any>) {
		let message = `Unsupported ${name} "${value}"`;
		if (mapping) message += `. Must be one of: ${Object.keys(mapping).join(', ')}`;
		super(message);
		this.name = 'UnsupportedError';
	}
}
