require('dotenv/config');
const router = require('./src/modules/router.ts').default;
const mantraConfig = require('./config/mantra.json');

process.env.NODE_ENV = 'dev';

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
	await invoke({
			'config': { ...mantraConfig, 'output': ['followUp', 'outputDeliverables', 'validatedCriticalProductionBlockers', 'validatedImportantClarifications', 'validatedBriefInconsistencies'] },
			'briefFolderUri': 'https://drive.google.com/drive/folders/1rKVJpWTn4KG5LbaEOkJj_dxHI7i7sNex',
			'additionalInfo': [],
			'now': '2025-09-04T14:16:49.353Z'
		}
	);
}());
