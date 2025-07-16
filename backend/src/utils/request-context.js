const { AsyncLocalStorage } = require('node:async_hooks');

const asyncLocalStorage = new AsyncLocalStorage();
const _localMock = {};

// TODO make symmetrical
module.exports = {
	run: (data, callback) => asyncLocalStorage.run(data, callback),
	get: () => asyncLocalStorage.getStore() ?? _localMock,
	set: (key, value) => {
		this.get()[key] = value;
	}
};
