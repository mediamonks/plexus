require('dotenv/config');
const Router = require('./src/core/Router.ts').default;
// const config = require('./config/test/copydesk.json');
// const config = require('./config/test/mantra.json');
const config = require('./config/test/luis.json');
// const config = require('./config/test/test.json');
const gcs = require('./src/services/google-cloud/GoogleCloudStorage.ts').default;

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
	
	// await invoke({ config, fields: {
	// 	briefFolderUri: `https://drive.google.com/drive/folders/1a2_DTNuBIfTFb8Spi6FnQWEt1abTzwgw`,
	// 	additionalInfo: '',
	// 	now: new Date().toISOString(),
	// } });
	
	await invoke({
		"config": config,
		"fields": {
			"request": "No additional information provided. Please analyze only the documents in the folder.",
			"documentFolder": "https://drive.google.com/drive/folders/13kI3QJVBZ1nqnX4cFmKhHOL61KfKp_pF?usp=drive_link"
		}
	});
	
}());
