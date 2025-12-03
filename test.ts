require('dotenv/config');
const Router = require('./src/core/Router.ts').default;
// const payload = require('./config/test/copydesk.json');
// const payload = require('./config/test/mantra.json');
// const payload = require('./config/test/luis.json');
const payload = require('./config/test/test.json');
const gcs = require('./src/services/google-cloud/CloudStorage.ts').default;

process.env.NODE_ENV = 'dev';

async function authentication() {
	console.log('Warming up GCS authentication...');
	const startTime = performance.now();
	
	try {
		
		try {
			await gcs.list('gs://monks-plexus/');
		} catch (error) {
		}
		
		console.log(`GCS authentication warmup completed in ${Math.floor(performance.now() - startTime)}ms`);
	} catch (error) {
		console.warn('GCS authentication failed:', error.message);
	}
}

async function invoke(body) {
	let response;
	await Router.handle({
		method: 'POST',
		path: '/invoke',
		body,
		get: () => '',
	}, {
		// send: v => console.dir(v, { depth: 10 }),
		send: v => {
			response = v;
			console.dir(v, { depth: 10 });
		},
		status: console.log,
		set: () => undefined
	});
	return response;
}

async function ingest(namespace, body) {
	let response;
	await Router.handle({
		method: 'POST',
		path: `/ingest/${namespace}`,
		body,
		get: () => '',
	}, {
		// send: v => console.dir(v, { depth: 10 }),
		send: v => {
			response = v;
			console.dir(v, { depth: 10 });
		},
		status: console.log,
		set: () => undefined
	});
	return response;
}

(async function () {
	
	await authentication();
	
	// await invoke(payload);
	
	await ingest('test', payload);
	
}());
