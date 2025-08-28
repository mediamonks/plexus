import { performance } from 'node:perf_hooks';

const DELAY = 1000;
const SERVICE = {
	DRIVE: 'drive',
	SHEETS: 'sheets',
};
const OPERATION = {
	READ: 'read',
	WRITE: 'write',
};
const _lastRequest = {};
const queue = {};
const _timeout = {}

async function quotaDelay(service: string = SERVICE.DRIVE, operation: string = OPERATION.READ): Promise<void> {
	let lastRequest = _lastRequest?.[service]?.[operation];
	while (lastRequest && performance.now() - lastRequest < DELAY) {
		await new Promise(resolve => setTimeout(resolve,  lastRequest + DELAY - performance.now()));
		lastRequest = _lastRequest?.[service]?.[operation];
	}
	_lastRequest[service] ??= {};
	_lastRequest[service][operation] = performance.now();
}

async function performOperation(service: string, operation: string): Promise<void> {
	if (_timeout[service]?.[operation]) {
		clearTimeout(_timeout[service][operation]);
		delete _timeout[service][operation];
	}
	
	_lastRequest[service] ??= {};
	_lastRequest[service][operation] = performance.now();
	
	const { fn, resolve } = queue[service][operation].shift();
	resolve(await fn());
	
	processQueue(service, operation).then();
}

async function processQueue(service: string = SERVICE.DRIVE, operation: string = OPERATION.READ): Promise<void> {
	if (!queue[service]?.[operation] || !queue[service]?.[operation].length) return;
	
	const lastRequest = _lastRequest?.[service]?.[operation];
	if (lastRequest && performance.now() - lastRequest < DELAY) {
		if (_timeout[service]?.[operation]) return;
		_timeout[service] ??= {};
		_timeout[service][operation] = setTimeout(() => {
			performOperation(service, operation);
		}, lastRequest + DELAY - performance.now());
		return;
	}
	
	await performOperation(service, operation);
}

async function enqueue(fn: () => Promise<any>, service: string = SERVICE.DRIVE, operation: string = OPERATION.READ): Promise<any> {
	return new Promise(resolve => {
		queue[service] ??= {};
		queue[service][operation] ??= [];
		queue[service][operation].push({ fn, resolve });
		processQueue(service, operation);
	});
}

export default {
	quotaDelay,
	SERVICE,
	OPERATION,
	enqueue,
};
