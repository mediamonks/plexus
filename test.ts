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

// (async function () {
// 	await invoke({
// 		"config": { ...mantraConfig, output: [
// 				"followUp",
// 				"outputDeliverables",
// 				"validatedCriticalProductionBlockers",
// 				"validatedImportantClarifications",
// 				"validatedBriefInconsistencies"
// 		] },
// 		"fields": {
// 			"briefFolderUri": "https://drive.google.com/drive/folders/1zOmWGFpsv6gCAehI7TIOduXAsCllWwdL",
// 			"additionalInfo": [
// 				"Localization of the EN USA assets, into Spanish-  USA, English  - Canadian, French - Canadian.\nSource files and visual references will be provided later. \nWe need to create the list of deliverables from the brief",
// 				":60, :30, and :15  -  are durations of the video, please put each duration separately\nplease make a separate line for each market US ES, CA FR, CA EN,\nUS EN assets are masters (source files) and will be provided next week\n",
// 				"TV, OLV/POLV, Cinema, Social - are channels, put them separately, assume that each video in each duration will be exported for all of them\nassume 16x9 ratio for TV, OLV, Cinema, and 9x16 and 1x1 for Social",
// 				".\n\n",
// 				"the brief is added\nplease make a breakdown of deliverables",
// 				"."
// 			],
// 			"now": "2025-09-11T08:56:46.039Z"
// 		}
// 	});
// }());

(async function () {
	await invoke({
		"config": require('./config/test.json'),
		"fields": {
			"name": "Luis"
		}
	});
}());
