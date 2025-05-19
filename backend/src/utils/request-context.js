const { AsyncLocalStorage } = require('node:async_hooks');

const asyncLocalStorage = new AsyncLocalStorage();

module.exports = {
	run: (data, callback) => asyncLocalStorage.run(data, callback),
	get: () => asyncLocalStorage.getStore(),
	set: (key, value) => {
		const store = asyncLocalStorage.getStore();
		if (store) store[key] = value;
	}
};
