const requestContext = require('./request-context');

module.exports = class Debug {
	static get _messages() {
		return requestContext.get()._debug ??= [];
	}
	
	static log(message) {
		this._messages.push(message);
		if (process.env.NODE_ENV === 'dev') console.debug('[DEBUG]', message);
	}
	
	static get() {
		return this._messages;
	}
};
