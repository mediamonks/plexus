require('dotenv').config();

process.env.NODE_ENV = 'dev';

const router = require('./src/modules/router');

async function generate(body) {
	let response;
	await router({
		method: 'POST',
		path: '/generate-copy',
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
	// await require('./src/modules/brand').setup('uber-eats');
	//
	// process.exit();
	
	await generate({
		'prompt': 'write some copy for our 2025 summer deals',
		'brandId': 'uber-eats',
		'campaignId': 'summer',
		'subThemeId': 'beach',
		'merchant': 'Big Sammy\'s Burger Shack',
		'product': 'Big Sammy\'s Double-greasy Gorillaburger',
		'offerTypeId': 'bogo',
		'offerAmount': 0,
		'isMemberExclusive': false,
		'languageId': 'en-us',
		'temperature': 0.5,
		'presetId': 'uber-eats'
	});
}());
