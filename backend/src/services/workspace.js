const { performance } = require('node:perf_hooks');

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

async function quotaDelay(service = SERVICE.DRIVE, operation = OPERATION.READ) {
	let lastRequest = _lastRequest?.[service]?.[operation];
	while (lastRequest && performance.now() - lastRequest < DELAY) {
		await new Promise(resolve => setTimeout(resolve,  lastRequest + DELAY - performance.now()));
		lastRequest = _lastRequest?.[service]?.[operation];
	}
	_lastRequest[service] ??= {};
	_lastRequest[service][operation] = performance.now();
}

async function performOperation(service, operation) {
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

async function processQueue(service = SERVICE.DRIVE, operation = OPERATION.READ) {
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

async function enqueue(fn, service = SERVICE.DRIVE, operation = OPERATION.READ) {
	return new Promise(resolve => {
		queue[service] ??= {};
		queue[service][operation] ??= [];
		queue[service][operation].push({ fn, resolve });
		processQueue(service, operation);
	});
}

module.exports = {
	quotaDelay,
	SERVICE,
	OPERATION,
	enqueue,
};
