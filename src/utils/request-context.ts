import { AsyncLocalStorage } from 'node:async_hooks';

const asyncLocalStorage = new AsyncLocalStorage();
const _localMock = {};

// TODO make symmetrical
export default {
	run: (data: any, callback: () => any): any => asyncLocalStorage.run(data, callback),
	get: (): any => asyncLocalStorage.getStore() ?? _localMock,
	set: (key: string, value: any): void => {
		this.get()[key] = value;
	}
};
