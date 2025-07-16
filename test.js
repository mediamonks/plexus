require('dotenv').config();

process.env.NODE_ENV = 'dev';

const router = require('./src/modules/router');

async function invoke(body) {
	let response;
	await router({
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

(async function () {
	// await require('./src/modules/ingest').ingestAll('whitelabel');
	// await require('./src/modules/ingest').ingest('whitelabel-examples');
	// process.exit();
	
	// await invoke({
	// 	'prompt': 'Write me something that rhymes',
	// 	'channel': 'instagram',
	// 	'product': 'sandal-ruby-eau-de-parfum',
	// 	'targetAudience': 'women-35-55',
	// 	'toneOfVoice': 'modern',
	// 	'targetLength': 100,
	// 	'maxCharacters': 200,
	// 	'language': 'fr-fr',
	// });
	
	await invoke({
		briefFolderId: '1rSiyIwSQMBCVfr4U4r_3O-ouCxDf-w9Y',
		outputFolderId: '1qoqqlQX29E4_za4JTdRX5P5uPZRQuPx4',
		config: {
			output: [
				'followUp',
				'outputDeliverables',
			]
		}
	});
}());
