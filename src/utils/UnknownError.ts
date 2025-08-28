export default class UnknownError extends Error {
	constructor(name: string, value: string, mapping: Record<string, any>) {
		const message = `Unknown ${name} "${value}". Must be one of: ${Object.keys(mapping).join(', ')}`;
		super(message);
		this.name = 'UnknownError';
	}
}
