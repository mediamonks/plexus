import CustomError from './CustomError';

export default class UnsupportedError extends CustomError {
	public constructor(name: string, value: string, values?: string[]) {
		let message = `Unsupported ${name}: "${value}"`;
		if (values) message += `. Must be one of: ${values.map(value => `"${value}"`).join(', ')}`;
		super(message);
	}
};
