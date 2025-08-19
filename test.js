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
	
	// await invoke({
	// 	'config': {
	// 		'output': [
	// 			'followUp',
	// 			'outputDeliverables',
	// 			'validatedCriticalProductionBlockers',
	// 			'validatedImportantClarifications',
	// 			'validatedBriefInconsistencies'
	// 		]
	// 	},
	// 	'briefFolderId': '1FUhHa7kO_3qjggxoeratAj1haCGhjWDV',
	// 	'outputFolderId': '1B1SYAgbtnECh3E24o0T8XwtbDPTrwvuh',
	// 	'additionalInfo': [],
	// 	'now': '2025-07-30T09:52:23.637Z'
	// });
	
	await invoke({
		'config': { 'output': ['outputQuote', 'outputTimeline'] },
		'ratecardId': null,
		'ratecardData': {
			'name': 'General Motors Rate card',
			'data': [{
				'id': 924,
				'code': 'NO-JOBFAMILY-00',
				'category': 'TV Spot',
				'role': 'Very Simple TV Spot',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '145.00' }],
				'location': null
			}, {
				'id': 925,
				'code': 'NO-JOBFAMILY-00',
				'category': 'TV Spot',
				'role': 'Simple TV Spot',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '194.00' }],
				'location': null
			}, {
				'id': 926,
				'code': 'NO-JOBFAMILY-00',
				'category': 'TV Spot',
				'role': 'Medium TV Spot',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '324.00' }],
				'location': null
			}, {
				'id': 927,
				'code': 'NO-JOBFAMILY-00',
				'category': 'TV Spot',
				'role': 'Complex TV Spot',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '902.00' }],
				'location': null
			}, {
				'id': 928,
				'code': 'NO-JOBFAMILY-00',
				'category': 'TV Spot',
				'role': 'Revision -  Very Simple TV Spot',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '22.00' }],
				'location': null
			}, {
				'id': 929,
				'code': 'NO-JOBFAMILY-00',
				'category': 'TV Spot',
				'role': 'Revision -  Simple TV Spot',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '29.00' }],
				'location': null
			}, {
				'id': 930,
				'code': 'NO-JOBFAMILY-00',
				'category': 'TV Spot',
				'role': 'Revision - Medium TV Spot',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '49.00' }],
				'location': null
			}, {
				'id': 931,
				'code': 'NO-JOBFAMILY-00',
				'category': 'TV Spot',
				'role': 'Revision - Complex TV Spot',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '135.00' }],
				'location': null
			}, {
				'id': 932,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Radio Spot',
				'role': 'Very Simple Radio Spot',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '183.00' }],
				'location': null
			}, {
				'id': 933,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Radio Spot',
				'role': 'Simple Radio Spot',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '276.00' }],
				'location': null
			}, {
				'id': 934,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Radio Spot',
				'role': 'Medium Radio Spot',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '427.00' }],
				'location': null
			}, {
				'id': 935,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Radio Spot',
				'role': 'Complex Radio Spot',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '611.00' }],
				'location': null
			}, {
				'id': 936,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Radio Spot',
				'role': 'Revision -  Very Simple Radio Spot',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '27.00' }],
				'location': null
			}, {
				'id': 937,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Radio Spot',
				'role': 'Revision -  Simple Radio Spot',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '41.00' }],
				'location': null
			}, {
				'id': 938,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Radio Spot',
				'role': 'Revision - Medium Radio Spot',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '64.00' }],
				'location': null
			}, {
				'id': 939,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Radio Spot',
				'role': 'Revision - Complex Radio Spot',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '92.00' }],
				'location': null
			}, {
				'id': 940,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Subtitling',
				'role': 'Simple Subtitling',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '101.00' }],
				'location': null
			}, {
				'id': 941,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Subtitling',
				'role': 'Complex Subtitling',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '216.00' }],
				'location': null
			}, {
				'id': 942,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Print/Out of Home',
				'role': 'Very Simple Print/Out of Home',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '79.00' }],
				'location': null
			}, {
				'id': 943,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Print/Out of Home',
				'role': 'Simple Print/Out of Home',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '143.00' }],
				'location': null
			}, {
				'id': 944,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Print/Out of Home',
				'role': 'Medium Print/Out of Home',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '167.00' }],
				'location': null
			}, {
				'id': 945,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Print/Out of Home',
				'role': 'Complex Print/Out of Home',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '370.00' }],
				'location': null
			}, {
				'id': 946,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Print/Out of Home',
				'role': 'Revision -  Very Simple Print/Out of Home',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '12.00' }],
				'location': null
			}, {
				'id': 947,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Print/Out of Home',
				'role': 'Revision -  Simple Print/Out of Home',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '21.00' }],
				'location': null
			}, {
				'id': 948,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Print/Out of Home',
				'role': 'Revision - Medium Print/Out of Home',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '25.00' }],
				'location': null
			}, {
				'id': 949,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Print/Out of Home',
				'role': 'Revision - Complex Print/Out of Home',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '56.00' }],
				'location': null
			}, {
				'id': 950,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Point of Sale',
				'role': 'Very Simple Point of Sale',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '79.00' }],
				'location': null
			}, {
				'id': 951,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Point of Sale',
				'role': 'Simple Point of Sale',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '191.00' }],
				'location': null
			}, {
				'id': 952,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Point of Sale',
				'role': 'Medium Point of Sale',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '191.00' }],
				'location': null
			}, {
				'id': 953,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Point of Sale',
				'role': 'Complex Point of Sale',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '296.00' }],
				'location': null
			}, {
				'id': 954,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Point of Sale',
				'role': 'Revision - Very Simple Point of Sale',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '12.00' }],
				'location': null
			}, {
				'id': 955,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Point of Sale',
				'role': 'Revision -  Simple Point of Sale',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '29.00' }],
				'location': null
			}, {
				'id': 956,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Point of Sale',
				'role': 'Revision - Medium Point of Sale',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '29.00' }],
				'location': null
			}, {
				'id': 957,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Point of Sale',
				'role': 'Revision - Complex Point of Sale',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '44.00' }],
				'location': null
			}, {
				'id': 958,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Saver Sheet/ Hero Card',
				'role': 'Very Simple Saver Sheet/ Hero Card',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '110.00' }],
				'location': null
			}, {
				'id': 959,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Saver Sheet/ Hero Card',
				'role': 'Simple Saver Sheet/ Hero Card',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '153.00' }],
				'location': null
			}, {
				'id': 960,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Saver Sheet/ Hero Card',
				'role': 'Medium Saver Sheet/ Hero Card',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '191.00' }],
				'location': null
			}, {
				'id': 961,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Saver Sheet/ Hero Card',
				'role': 'Complex Saver Sheet/ Hero Card',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '296.00' }],
				'location': null
			}, {
				'id': 962,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Saver Sheet/ Hero Card',
				'role': 'Revision - Very Simple Saver Sheet/ Hero Card',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '16.00' }],
				'location': null
			}, {
				'id': 963,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Saver Sheet/ Hero Card',
				'role': 'Revision -  Simple Saver Sheet/ Hero Card',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '23.00' }],
				'location': null
			}, {
				'id': 964,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Saver Sheet/ Hero Card',
				'role': 'Revision - Medium Saver Sheet/ Hero Card',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '29.00' }],
				'location': null
			}, {
				'id': 965,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Saver Sheet/ Hero Card',
				'role': 'Revision - Complex Saver Sheet/ Hero Card',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '44.00' }],
				'location': null
			}, {
				'id': 966,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Catalogs',
				'role': 'Very Simple Catalogs',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '66.00' }],
				'location': null
			}, {
				'id': 967,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Catalogs',
				'role': 'Simple Catalogs',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '191.00' }],
				'location': null
			}, {
				'id': 968,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Catalogs',
				'role': 'Medium Catalogs',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '239.00' }],
				'location': null
			}, {
				'id': 969,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Catalogs',
				'role': 'Complex Catalogs',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '518.00' }],
				'location': null
			}, {
				'id': 970,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Catalogs',
				'role': 'Revision - Very Simple Catalogs',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '10.00' }],
				'location': null
			}, {
				'id': 971,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Catalogs',
				'role': 'Revision -  Simple Catalogs',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '29.00' }],
				'location': null
			}, {
				'id': 972,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Catalogs',
				'role': 'Revision - Medium Catalogs',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '36.00' }],
				'location': null
			}, {
				'id': 973,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Catalogs',
				'role': 'Revision - Complex Catalogs',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '78.00' }],
				'location': null
			}, {
				'id': 974,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Retouching',
				'role': 'Offshore Retouching',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '191.00' }],
				'location': null
			}, {
				'id': 975,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Retouching',
				'role': 'Onshore Retouching',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '376.00' }],
				'location': null
			}, {
				'id': 976,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Web Feature Content',
				'role': 'Simple Web Feature Content',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '196.00' }],
				'location': null
			}, {
				'id': 977,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Web Feature Content',
				'role': 'Medium Web Feature Content',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '295.00' }],
				'location': null
			}, {
				'id': 978,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Web Feature Content',
				'role': 'Complex Web Feature Content',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '677.00' }],
				'location': null
			}, {
				'id': 979,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Web Feature Content',
				'role': 'Revision -  Simple Web Feature Content',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '29.00' }],
				'location': null
			}, {
				'id': 980,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Web Feature Content',
				'role': 'Revision - Medium Web Feature Content',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '44.00' }],
				'location': null
			}, {
				'id': 981,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Web Feature Content',
				'role': 'Revision - Complex Web Feature Content',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '101.00' }],
				'location': null
			}, {
				'id': 982,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Online Vehicle Page',
				'role': 'Simple Online Vehicle Page',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '191.00' }],
				'location': null
			}, {
				'id': 983,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Online Vehicle Page',
				'role': 'Medium Online Vehicle Page',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '286.00' }],
				'location': null
			}, {
				'id': 984,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Online Vehicle Page',
				'role': 'Complex Online Vehicle Page',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '942.00' }],
				'location': null
			}, {
				'id': 985,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Online Vehicle Page',
				'role': 'Revision -  Simple Online Vehicle Page',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '29.00' }],
				'location': null
			}, {
				'id': 986,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Online Vehicle Page',
				'role': 'Revision - Medium Online Vehicle Page',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '43.00' }],
				'location': null
			}, {
				'id': 987,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Online Vehicle Page',
				'role': 'Revision - Complex Online Vehicle Page',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '141.00' }],
				'location': null
			}, {
				'id': 988,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Mobile Site Page',
				'role': 'Simple Mobile Site Page',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '191.00' }],
				'location': null
			}, {
				'id': 989,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Mobile Site Page',
				'role': 'Medium Mobile Site Page',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '286.00' }],
				'location': null
			}, {
				'id': 990,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Mobile Site Page',
				'role': 'Complex Mobile Site Page',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '946.00' }],
				'location': null
			}, {
				'id': 991,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Mobile Site Page',
				'role': 'Revision -  Simple Mobile Site Page',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '29.00' }],
				'location': null
			}, {
				'id': 992,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Mobile Site Page',
				'role': 'Revision - Medium Mobile Site Page',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '43.00' }],
				'location': null
			}, {
				'id': 993,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Mobile Site Page',
				'role': 'Revision - Complex Mobile Site Page',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '142.00' }],
				'location': null
			}, {
				'id': 994,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Standard Banner',
				'role': 'Simple Standard Banner',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '72.00' }],
				'location': null
			}, {
				'id': 995,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Standard Banner',
				'role': 'Medium Standard Banner',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '143.00' }],
				'location': null
			}, {
				'id': 996,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Standard Banner',
				'role': 'Complex Standard Banner',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '516.00' }],
				'location': null
			}, {
				'id': 997,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Standard Banner',
				'role': 'Revision -  Simple Standard Banner',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '11.00' }],
				'location': null
			}, {
				'id': 998,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Standard Banner',
				'role': 'Revision - Medium Standard Banner',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '21.00' }],
				'location': null
			}, {
				'id': 999,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Standard Banner',
				'role': 'Revision - Complex Standard Banner',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '77.00' }],
				'location': null
			}, {
				'id': 1000,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Rich Media Banner',
				'role': 'Simple Rich Media Banner',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '119.00' }],
				'location': null
			}, {
				'id': 1001,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Rich Media Banner',
				'role': 'Medium Rich Media Banner',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '191.00' }],
				'location': null
			}, {
				'id': 1002,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Rich Media Banner',
				'role': 'Complex Rich Media Banner',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '688.00' }],
				'location': null
			}, {
				'id': 1003,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Rich Media Banner',
				'role': 'Revision -  Simple Rich Media Banner',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '18.00' }],
				'location': null
			}, {
				'id': 1004,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Rich Media Banner',
				'role': 'Revision - Medium Rich Media Banner',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '29.00' }],
				'location': null
			}, {
				'id': 1005,
				'code': 'NO-JOBFAMILY-00',
				'category': 'Rich Media Banner',
				'role': 'Revision - Complex Rich Media Banner',
				'jobFamily': 'No FTE No job family applicable',
				'level': 'No FTE - No Level',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '103.00' }],
				'location': null
			}, {
				'id': 1006,
				'code': 'BUS-ACM-08',
				'category': 'Account Management',
				'role': 'Head of Account Management',
				'jobFamily': 'Business Account Management',
				'level': 'VP',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '350' }],
				'location': null
			}, {
				'id': 1007,
				'code': 'BUS-ACM-08',
				'category': 'Account Management',
				'role': 'Head of Account Management',
				'jobFamily': 'Business Account Management',
				'level': 'VP',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '195.00' }],
				'location': null
			}, {
				'id': 1008,
				'code': 'BUS-ACM-08',
				'category': 'Account Management',
				'role': 'Head of Account Management',
				'jobFamily': 'Business Account Management',
				'level': 'VP',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '88.00' }],
				'location': null
			}, {
				'id': 1009,
				'code': 'BUS-ACM-07',
				'category': 'Account Management',
				'role': 'Group Account Director',
				'jobFamily': 'Business Account Management',
				'level': 'Senior Director',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '275.00' }],
				'location': null
			}, {
				'id': 1010,
				'code': 'BUS-ACM-07',
				'category': 'Account Management',
				'role': 'Group Account Director',
				'jobFamily': 'Business Account Management',
				'level': 'Senior Director',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '86.00' }],
				'location': null
			}, {
				'id': 1011,
				'code': 'BUS-ACM-05',
				'category': 'Account Management',
				'role': 'Associate Group Account Director',
				'jobFamily': 'Business Account Management',
				'level': 'Associate Director',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '250.00' }],
				'location': null
			}, {
				'id': 1012,
				'code': 'BUS-ACM-04',
				'category': 'Account Management',
				'role': 'Senior Account Director',
				'jobFamily': 'Business Account Management',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '225.00' }],
				'location': null
			}, {
				'id': 1013,
				'code': 'BUS-ACM-04',
				'category': 'Account Management',
				'role': 'Senior Account Director',
				'jobFamily': 'Business Account Management',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '170.00' }],
				'location': null
			}, {
				'id': 1014,
				'code': 'BUS-ACM-06',
				'category': 'Account Management',
				'role': 'Account Director',
				'jobFamily': 'Business Account Management',
				'level': 'Director',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '200.00' }],
				'location': null
			}, {
				'id': 1015,
				'code': 'BUS-ACM-06',
				'category': 'Account Management',
				'role': 'Account Director',
				'jobFamily': 'Business Account Management',
				'level': 'Director',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '119.00' }],
				'location': null
			}, {
				'id': 1016,
				'code': 'BUS-ACM-06',
				'category': 'Account Management',
				'role': 'Account Director',
				'jobFamily': 'Business Account Management',
				'level': 'Director',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '82.00' }],
				'location': null
			}, {
				'id': 1017,
				'code': 'BUS-ACM-04',
				'category': 'Account Management',
				'role': 'Senior Account Manager',
				'jobFamily': 'Business Account Management',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '160.00' }],
				'location': null
			}, {
				'id': 1018,
				'code': 'BUS-ACM-04',
				'category': 'Account Management',
				'role': 'Senior Account Manager',
				'jobFamily': 'Business Account Management',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '85.00' }],
				'location': null
			}, {
				'id': 1019,
				'code': 'BUS-ACM-04',
				'category': 'Account Management',
				'role': 'Senior Account Manager',
				'jobFamily': 'Business Account Management',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '71.00' }],
				'location': null
			}, {
				'id': 1020,
				'code': 'BUS-ACM-03',
				'category': 'Account Management',
				'role': 'Account Manager',
				'jobFamily': 'Business Account Management',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '125.00' }],
				'location': null
			}, {
				'id': 1021,
				'code': 'BUS-ACM-03',
				'category': 'Account Management',
				'role': 'Account Manager',
				'jobFamily': 'Business Account Management',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '75.00' }],
				'location': null
			}, {
				'id': 1022,
				'code': 'BUS-ACM-03',
				'category': 'Account Management',
				'role': 'Account Manager',
				'jobFamily': 'Business Account Management',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '69.00' }],
				'location': null
			}, {
				'id': 1023,
				'code': 'BUS-ACM-02',
				'category': 'Account Management',
				'role': 'Associate Account Manager',
				'jobFamily': 'Business Account Management',
				'level': 'Junior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '110.00' }],
				'location': null
			}, {
				'id': 1024,
				'code': 'BUS-ACM-02',
				'category': 'Account Management',
				'role': 'Associate Account Manager',
				'jobFamily': 'Business Account Management',
				'level': 'Junior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '52.00' }],
				'location': null
			}, {
				'id': 1025,
				'code': 'BUS-ACM-02',
				'category': 'Account Management',
				'role': 'Associate Account Manager',
				'jobFamily': 'Business Account Management',
				'level': 'Junior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '62.00' }],
				'location': null
			}, {
				'id': 1026,
				'code': 'CON-PRO-04',
				'category': 'Delivery',
				'role': 'Executive Producer',
				'jobFamily': 'Content Production / Coordination',
				'level': 'Lead',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '190.00' }],
				'location': null
			}, {
				'id': 1027,
				'code': 'CON-PRO-04',
				'category': 'Delivery',
				'role': 'Executive Producer',
				'jobFamily': 'Content Production / Coordination',
				'level': 'Lead',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '175.00' }],
				'location': null
			}, {
				'id': 1028,
				'code': 'CON-PRO-04',
				'category': 'Delivery',
				'role': 'Executive Producer',
				'jobFamily': 'Content Production / Coordination',
				'level': 'Lead',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '90.00' }],
				'location': null
			}, {
				'id': 1029,
				'code': 'CON-PRO-04',
				'category': 'Delivery',
				'role': 'Executive Producer',
				'jobFamily': 'Content Production / Coordination',
				'level': 'Lead',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '141.00' }],
				'location': null
			}, {
				'id': 1030,
				'code': 'CON-PRO-04',
				'category': 'Delivery',
				'role': 'Senior Producer / Project Manager',
				'jobFamily': 'Content Production / Coordination',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '157.00' }],
				'location': null
			}, {
				'id': 1031,
				'code': 'CON-PRO-04',
				'category': 'Delivery',
				'role': 'Senior Producer / Project Manager',
				'jobFamily': 'Content Production / Coordination',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '153.00' }],
				'location': null
			}, {
				'id': 1032,
				'code': 'CON-PRO-04',
				'category': 'Delivery',
				'role': 'Senior Producer / Project Manager',
				'jobFamily': 'Content Production / Coordination',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '80.00' }],
				'location': null
			}, {
				'id': 1033,
				'code': 'CON-PRO-04',
				'category': 'Delivery',
				'role': 'Senior Producer / Project Manager',
				'jobFamily': 'Content Production / Coordination',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '104.00' }],
				'location': null
			}, {
				'id': 1034,
				'code': 'CON-PRO-03',
				'category': 'Delivery',
				'role': 'Producer / Project Manager',
				'jobFamily': 'Content Production / Coordination',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '135.00' }],
				'location': null
			}, {
				'id': 1035,
				'code': 'CON-PRO-03',
				'category': 'Delivery',
				'role': 'Producer / Project Manager',
				'jobFamily': 'Content Production / Coordination',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '135.00' }],
				'location': null
			}, {
				'id': 1036,
				'code': 'CON-PRO-03',
				'category': 'Delivery',
				'role': 'Producer / Project Manager',
				'jobFamily': 'Content Production / Coordination',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '77.00' }],
				'location': null
			}, {
				'id': 1037,
				'code': 'CON-PRO-03',
				'category': 'Delivery',
				'role': 'Producer / Project Manager',
				'jobFamily': 'Content Production / Coordination',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '85.00' }],
				'location': null
			}, {
				'id': 1038,
				'code': 'CON-PRM-04',
				'category': 'Delivery',
				'role': 'Senior Technical Project Manager',
				'jobFamily': 'Content Project Management',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '135.00' }],
				'location': null
			}, {
				'id': 1039,
				'code': 'CON-PRM-04',
				'category': 'Delivery',
				'role': 'Senior Technical Project Manager',
				'jobFamily': 'Content Project Management',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '135.00' }],
				'location': null
			}, {
				'id': 1040,
				'code': 'CON-PRM-04',
				'category': 'Delivery',
				'role': 'Senior Technical Project Manager',
				'jobFamily': 'Content Project Management',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '75.00' }],
				'location': null
			}, {
				'id': 1041,
				'code': 'CON-PRM-04',
				'category': 'Delivery',
				'role': 'Senior Technical Project Manager',
				'jobFamily': 'Content Project Management',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '130.00' }],
				'location': null
			}, {
				'id': 1042,
				'code': 'CON-PRM-03',
				'category': 'Delivery',
				'role': 'Technical Project Manager',
				'jobFamily': 'Content Project Management',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '120.00' }],
				'location': null
			}, {
				'id': 1043,
				'code': 'CON-PRM-03',
				'category': 'Delivery',
				'role': 'Technical Project Manager',
				'jobFamily': 'Content Project Management',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '120.00' }],
				'location': null
			}, {
				'id': 1044,
				'code': 'CON-PRM-03',
				'category': 'Delivery',
				'role': 'Technical Project Manager',
				'jobFamily': 'Content Project Management',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '70.00' }],
				'location': null
			}, {
				'id': 1045,
				'code': 'CON-PRM-03',
				'category': 'Delivery',
				'role': 'Technical Project Manager',
				'jobFamily': 'Content Project Management',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '107.00' }],
				'location': null
			}, {
				'id': 1046,
				'code': 'CON-PRM-03',
				'category': 'Delivery',
				'role': 'AdOps Manager',
				'jobFamily': 'Content Project Management',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '45.00' }],
				'location': null
			}, {
				'id': 1047,
				'code': 'CON-PRM-04',
				'category': 'Delivery',
				'role': 'Senior Project Manager',
				'jobFamily': 'Content Project Management',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '125.00' }],
				'location': null
			}, {
				'id': 1048,
				'code': 'CON-PRM-04',
				'category': 'Delivery',
				'role': 'Senior Project Manager',
				'jobFamily': 'Content Project Management',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '120.00' }],
				'location': null
			}, {
				'id': 1049,
				'code': 'CON-PRM-04',
				'category': 'Delivery',
				'role': 'Senior Project Manager',
				'jobFamily': 'Content Project Management',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '84.00' }],
				'location': null
			}, {
				'id': 1050,
				'code': 'CON-PRM-04',
				'category': 'Delivery',
				'role': 'Senior Project Manager',
				'jobFamily': 'Content Project Management',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '55.00' }],
				'location': null
			}, {
				'id': 1051,
				'code': 'DEV-BAN-03',
				'category': 'Delivery',
				'role': 'Business Analyst',
				'jobFamily': 'Development Business Analytics',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '100.00' }],
				'location': null
			}, {
				'id': 1052,
				'code': 'DEV-BAN-03',
				'category': 'Delivery',
				'role': 'Business Analyst',
				'jobFamily': 'Development Business Analytics',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '100.00' }],
				'location': null
			}, {
				'id': 1053,
				'code': 'DEV-BAN-03',
				'category': 'Delivery',
				'role': 'Business Analyst',
				'jobFamily': 'Development Business Analytics',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '70.00' }],
				'location': null
			}, {
				'id': 1054,
				'code': 'DEV-BAN-03',
				'category': 'Delivery',
				'role': 'Business Analyst',
				'jobFamily': 'Development Business Analytics',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '104.00' }],
				'location': null
			}, {
				'id': 1055,
				'code': 'CON-PRO-02',
				'category': 'Delivery',
				'role': 'Associate Producer / Project Manager',
				'jobFamily': 'Content Production / Coordination',
				'level': 'Junior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '95.00' }],
				'location': null
			}, {
				'id': 1056,
				'code': 'CON-PRO-02',
				'category': 'Delivery',
				'role': 'Associate Producer / Project Manager',
				'jobFamily': 'Content Production / Coordination',
				'level': 'Junior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '95.00' }],
				'location': null
			}, {
				'id': 1057,
				'code': 'CON-PRO-02',
				'category': 'Delivery',
				'role': 'Associate Producer / Project Manager',
				'jobFamily': 'Content Production / Coordination',
				'level': 'Junior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '65.00' }],
				'location': null
			}, {
				'id': 1058,
				'code': 'CON-PRO-02',
				'category': 'Delivery',
				'role': 'Associate Producer / Project Manager',
				'jobFamily': 'Content Production / Coordination',
				'level': 'Junior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '59.00' }],
				'location': null
			}, {
				'id': 1059,
				'code': 'CRE-CON-09',
				'category': 'Creative',
				'role': 'Executive Creative Director',
				'jobFamily': 'Creative Concept',
				'level': 'SVP',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '500.00' }],
				'location': null
			}, {
				'id': 1060,
				'code': 'CRE-CON-09',
				'category': 'Creative',
				'role': 'Executive Creative Director',
				'jobFamily': 'Creative Concept',
				'level': 'SVP',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '230.00' }],
				'location': null
			}, {
				'id': 1061,
				'code': 'CRE-CON-09',
				'category': 'Creative',
				'role': 'Executive Creative Director',
				'jobFamily': 'Creative Concept',
				'level': 'SVP',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '94.00' }],
				'location': null
			}, {
				'id': 1062,
				'code': 'CRE-CON-07',
				'category': 'Creative',
				'role': 'Group Creative Director',
				'jobFamily': 'Creative Concept',
				'level': 'Senior Director',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '375.00' }],
				'location': null
			}, {
				'id': 1063,
				'code': 'CRE-CON-07',
				'category': 'Creative',
				'role': 'Group Creative Director',
				'jobFamily': 'Creative Concept',
				'level': 'Senior Director',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '215.00' }],
				'location': null
			}, {
				'id': 1064,
				'code': 'CRE-CON-07',
				'category': 'Creative',
				'role': 'Group Creative Director',
				'jobFamily': 'Creative Concept',
				'level': 'Senior Director',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '91.00' }],
				'location': null
			}, {
				'id': 1065,
				'code': 'CRE-CON-06',
				'category': 'Creative',
				'role': 'Creative Director',
				'jobFamily': 'Creative Concept',
				'level': 'Director',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '325.00' }],
				'location': null
			}, {
				'id': 1066,
				'code': 'CRE-CON-06',
				'category': 'Creative',
				'role': 'Creative Director',
				'jobFamily': 'Creative Concept',
				'level': 'Director',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '180.00' }],
				'location': null
			}, {
				'id': 1067,
				'code': 'CRE-CON-06',
				'category': 'Creative',
				'role': 'Creative Director',
				'jobFamily': 'Creative Concept',
				'level': 'Director',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '90.00' }],
				'location': null
			}, {
				'id': 1068,
				'code': 'CRE-CON-05',
				'category': 'Creative',
				'role': 'Associate Creative Director',
				'jobFamily': 'Creative Concept',
				'level': 'Associate Director',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '250.00' }],
				'location': null
			}, {
				'id': 1069,
				'code': 'CRE-CON-05',
				'category': 'Creative',
				'role': 'Associate Creative Director',
				'jobFamily': 'Creative Concept',
				'level': 'Associate Director',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '145.00' }],
				'location': null
			}, {
				'id': 1070,
				'code': 'CRE-CON-05',
				'category': 'Creative',
				'role': 'Associate Creative Director',
				'jobFamily': 'Creative Concept',
				'level': 'Associate Director',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '75.00' }],
				'location': null
			}, {
				'id': 1071,
				'code': 'CRE-CON-07',
				'category': 'Creative',
				'role': 'Senior Art Director',
				'jobFamily': 'Creative Concept',
				'level': 'Senior Director',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '165.00' }],
				'location': null
			}, {
				'id': 1072,
				'code': 'CRE-CON-07',
				'category': 'Creative',
				'role': 'Senior Art Director',
				'jobFamily': 'Creative Concept',
				'level': 'Senior Director',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '165.00' }],
				'location': null
			}, {
				'id': 1073,
				'code': 'CRE-CON-07',
				'category': 'Creative',
				'role': 'Senior Art Director',
				'jobFamily': 'Creative Concept',
				'level': 'Senior Director',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '92.00' }],
				'location': null
			}, {
				'id': 1074,
				'code': 'CRE-CON-07',
				'category': 'Creative',
				'role': 'Senior Art Director',
				'jobFamily': 'Creative Concept',
				'level': 'Senior Director',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '126.00' }],
				'location': null
			}, {
				'id': 1075,
				'code': 'CRE-CON-06',
				'category': 'Creative',
				'role': 'Art Director',
				'jobFamily': 'Creative Concept',
				'level': 'Director',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '152.00' }],
				'location': null
			}, {
				'id': 1076,
				'code': 'CRE-CON-06',
				'category': 'Creative',
				'role': 'Art Director',
				'jobFamily': 'Creative Concept',
				'level': 'Director',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '152.00' }],
				'location': null
			}, {
				'id': 1077,
				'code': 'CRE-CON-06',
				'category': 'Creative',
				'role': 'Art Director',
				'jobFamily': 'Creative Concept',
				'level': 'Director',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '90.00' }],
				'location': null
			}, {
				'id': 1078,
				'code': 'CRE-CON-06',
				'category': 'Creative',
				'role': 'Art Director',
				'jobFamily': 'Creative Concept',
				'level': 'Director',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '115.00' }],
				'location': null
			}, {
				'id': 1079,
				'code': 'CRE-CON-04',
				'category': 'Creative',
				'role': 'Senior Designer',
				'jobFamily': 'Creative Concept',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '175.00' }],
				'location': null
			}, {
				'id': 1080,
				'code': 'CRE-CON-04',
				'category': 'Creative',
				'role': 'Senior Designer',
				'jobFamily': 'Creative Concept',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '110.00' }],
				'location': null
			}, {
				'id': 1081,
				'code': 'CRE-CON-04',
				'category': 'Creative',
				'role': 'Senior Designer',
				'jobFamily': 'Creative Concept',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '71.00' }],
				'location': null
			}, {
				'id': 1082,
				'code': 'CRE-DES-03',
				'category': 'Creative',
				'role': 'Designer',
				'jobFamily': 'Creative Design',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '160.00' }],
				'location': null
			}, {
				'id': 1083,
				'code': 'CRE-DES-03',
				'category': 'Creative',
				'role': 'Designer',
				'jobFamily': 'Creative Design',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '91.00' }],
				'location': null
			}, {
				'id': 1084,
				'code': 'CRE-DES-03',
				'category': 'Creative',
				'role': 'Designer',
				'jobFamily': 'Creative Design',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '69.00' }],
				'location': null
			}, {
				'id': 1085,
				'code': 'CRE-COP-04',
				'category': 'Creative',
				'role': 'Senior Copywriter',
				'jobFamily': 'Creative Copy',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '175.00' }],
				'location': null
			}, {
				'id': 1086,
				'code': 'CRE-COP-04',
				'category': 'Creative',
				'role': 'Senior Copywriter',
				'jobFamily': 'Creative Copy',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '110.00' }],
				'location': null
			}, {
				'id': 1087,
				'code': 'CRE-COP-04',
				'category': 'Creative',
				'role': 'Senior Copywriter',
				'jobFamily': 'Creative Copy',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '71.00' }],
				'location': null
			}, {
				'id': 1088,
				'code': 'CRE-COP-03',
				'category': 'Creative',
				'role': 'Copywriter',
				'jobFamily': 'Creative Copy',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '160.00' }],
				'location': null
			}, {
				'id': 1089,
				'code': 'CRE-COP-03',
				'category': 'Creative',
				'role': 'Copywriter',
				'jobFamily': 'Creative Copy',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '91.00' }],
				'location': null
			}, {
				'id': 1090,
				'code': 'CRE-COP-03',
				'category': 'Creative',
				'role': 'Copywriter',
				'jobFamily': 'Creative Copy',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '69.00' }],
				'location': null
			}, {
				'id': 1091,
				'code': 'CRE-ART-04',
				'category': 'Creative',
				'role': 'Senior Illustrator',
				'jobFamily': 'Creative Art & Illustration',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '110.00' }],
				'location': null
			}, {
				'id': 1092,
				'code': 'CRE-ART-04',
				'category': 'Creative',
				'role': 'Senior Illustrator',
				'jobFamily': 'Creative Art & Illustration',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '110.00' }],
				'location': null
			}, {
				'id': 1093,
				'code': 'CRE-ART-04',
				'category': 'Creative',
				'role': 'Senior Illustrator',
				'jobFamily': 'Creative Art & Illustration',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '85.00' }],
				'location': null
			}, {
				'id': 1094,
				'code': 'CRE-ART-04',
				'category': 'Creative',
				'role': 'Senior Illustrator',
				'jobFamily': 'Creative Art & Illustration',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '104.00' }],
				'location': null
			}, {
				'id': 1095,
				'code': 'CRE-ART-03',
				'category': 'Creative',
				'role': 'Illustrator',
				'jobFamily': 'Creative Art & Illustration',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '100.00' }],
				'location': null
			}, {
				'id': 1096,
				'code': 'CRE-ART-03',
				'category': 'Creative',
				'role': 'Illustrator',
				'jobFamily': 'Creative Art & Illustration',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '100.00' }],
				'location': null
			}, {
				'id': 1097,
				'code': 'CRE-ART-03',
				'category': 'Creative',
				'role': 'Illustrator',
				'jobFamily': 'Creative Art & Illustration',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '70.00' }],
				'location': null
			}, {
				'id': 1098,
				'code': 'CRE-ART-03',
				'category': 'Creative',
				'role': 'Illustrator',
				'jobFamily': 'Creative Art & Illustration',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '100.00' }],
				'location': null
			}, {
				'id': 1099,
				'code': 'CRE-MOT-04',
				'category': 'Animation',
				'role': 'Motion Designer Lead',
				'jobFamily': 'Creative Motion & Animation',
				'level': 'Lead',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '250.00' }],
				'location': null
			}, {
				'id': 1100,
				'code': 'CRE-MOT-04',
				'category': 'Animation',
				'role': 'Senior Motion Designer',
				'jobFamily': 'Creative Motion & Animation',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '225.00' }],
				'location': null
			}, {
				'id': 1101,
				'code': 'CRE-MOT-04',
				'category': 'Animation',
				'role': 'Senior Motion Designer',
				'jobFamily': 'Creative Motion & Animation',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '137.00' }],
				'location': null
			}, {
				'id': 1102,
				'code': 'CRE-MOT-04',
				'category': 'Animation',
				'role': 'Senior Motion Designer',
				'jobFamily': 'Creative Motion & Animation',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '92.00' }],
				'location': null
			}, {
				'id': 1103,
				'code': 'CRE-MOT-04',
				'category': 'Animation',
				'role': 'Senior Motion Designer',
				'jobFamily': 'Creative Motion & Animation',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '104.00' }],
				'location': null
			}, {
				'id': 1104,
				'code': 'CRE-MOT-03',
				'category': 'Animation',
				'role': 'Motion Designer',
				'jobFamily': 'Creative Motion & Animation',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '130.00' }],
				'location': null
			}, {
				'id': 1105,
				'code': 'CRE-MOT-03',
				'category': 'Animation',
				'role': 'Motion Designer',
				'jobFamily': 'Creative Motion & Animation',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '130.00' }],
				'location': null
			}, {
				'id': 1106,
				'code': 'CRE-MOT-03',
				'category': 'Animation',
				'role': 'Motion Designer',
				'jobFamily': 'Creative Motion & Animation',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '90.00' }],
				'location': null
			}, {
				'id': 1107,
				'code': 'CRE-MOT-03',
				'category': 'Animation',
				'role': 'Motion Designer',
				'jobFamily': 'Creative Motion & Animation',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '100.00' }],
				'location': null
			}, {
				'id': 1108,
				'code': 'DEV-TED-06',
				'category': 'Development',
				'role': 'Technical Director',
				'jobFamily': 'Development Technical Direction',
				'level': 'Director',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '160.00' }],
				'location': null
			}, {
				'id': 1109,
				'code': 'DEV-TED-06',
				'category': 'Development',
				'role': 'Technical Director',
				'jobFamily': 'Development Technical Direction',
				'level': 'Director',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '160.00' }],
				'location': null
			}, {
				'id': 1110,
				'code': 'DEV-TED-06',
				'category': 'Development',
				'role': 'Technical Director',
				'jobFamily': 'Development Technical Direction',
				'level': 'Director',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '100.00' }],
				'location': null
			}, {
				'id': 1111,
				'code': 'DEV-TED-06',
				'category': 'Development',
				'role': 'Technical Director',
				'jobFamily': 'Development Technical Direction',
				'level': 'Director',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '141.00' }],
				'location': null
			}, {
				'id': 1112,
				'code': 'DEV-FRO-04',
				'category': 'Development',
				'role': 'Lead Developer - Front End',
				'jobFamily': 'Development Front-end',
				'level': 'Lead',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '155.00' }],
				'location': null
			}, {
				'id': 1113,
				'code': 'DEV-FRO-04',
				'category': 'Development',
				'role': 'Lead Developer - Front End',
				'jobFamily': 'Development Front-end',
				'level': 'Lead',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '155.00' }],
				'location': null
			}, {
				'id': 1114,
				'code': 'DEV-FRO-04',
				'category': 'Development',
				'role': 'Lead Developer - Front End',
				'jobFamily': 'Development Front-end',
				'level': 'Lead',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '90.00' }],
				'location': null
			}, {
				'id': 1115,
				'code': 'DEV-FRO-04',
				'category': 'Development',
				'role': 'Lead Developer - Front End',
				'jobFamily': 'Development Front-end',
				'level': 'Lead',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '122.00' }],
				'location': null
			}, {
				'id': 1116,
				'code': 'DEV-FRO-04',
				'category': 'Development',
				'role': 'Senior Developer - Front End',
				'jobFamily': 'Development Front-end',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '145.00' }],
				'location': null
			}, {
				'id': 1117,
				'code': 'DEV-FRO-04',
				'category': 'Development',
				'role': 'Senior Developer - Front End',
				'jobFamily': 'Development Front-end',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '145.00' }],
				'location': null
			}, {
				'id': 1118,
				'code': 'DEV-FRO-04',
				'category': 'Development',
				'role': 'Senior Developer - Front End',
				'jobFamily': 'Development Front-end',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '85.00' }],
				'location': null
			}, {
				'id': 1119,
				'code': 'DEV-FRO-04',
				'category': 'Development',
				'role': 'Senior Developer - Front End',
				'jobFamily': 'Development Front-end',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '111.00' }],
				'location': null
			}, {
				'id': 1120,
				'code': 'DEV-FRO-03',
				'category': 'Development',
				'role': 'Developer - Front End',
				'jobFamily': 'Development Front-end',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '120.00' }],
				'location': null
			}, {
				'id': 1121,
				'code': 'DEV-FRO-03',
				'category': 'Development',
				'role': 'Developer - Front End',
				'jobFamily': 'Development Front-end',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '120.00' }],
				'location': null
			}, {
				'id': 1122,
				'code': 'DEV-FRO-03',
				'category': 'Development',
				'role': 'Developer - Front End',
				'jobFamily': 'Development Front-end',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '75.00' }],
				'location': null
			}, {
				'id': 1123,
				'code': 'DEV-FRO-03',
				'category': 'Development',
				'role': 'Developer - Front End',
				'jobFamily': 'Development Front-end',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '85.00' }],
				'location': null
			}, {
				'id': 1124,
				'code': 'DEV-FRO-03',
				'category': 'Development',
				'role': 'Development Manager - Front End',
				'jobFamily': 'Development Front-end',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '130.00' }],
				'location': null
			}, {
				'id': 1125,
				'code': 'DEV-FRO-03',
				'category': 'Development',
				'role': 'Development Manager - Front End',
				'jobFamily': 'Development Front-end',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '130.00' }],
				'location': null
			}, {
				'id': 1126,
				'code': 'DEV-FRO-03',
				'category': 'Development',
				'role': 'Development Manager - Front End',
				'jobFamily': 'Development Front-end',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '75.00' }],
				'location': null
			}, {
				'id': 1127,
				'code': 'DEV-FRO-03',
				'category': 'Development',
				'role': 'Development Manager - Front End',
				'jobFamily': 'Development Front-end',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '130.00' }],
				'location': null
			}, {
				'id': 1128,
				'code': 'DEV-BAC-04',
				'category': 'Development',
				'role': 'Lead Developer - Back End',
				'jobFamily': 'Development Back-end',
				'level': 'Lead',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '155.00' }],
				'location': null
			}, {
				'id': 1129,
				'code': 'DEV-BAC-04',
				'category': 'Development',
				'role': 'Lead Developer - Back End',
				'jobFamily': 'Development Back-end',
				'level': 'Lead',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '155.00' }],
				'location': null
			}, {
				'id': 1130,
				'code': 'DEV-BAC-04',
				'category': 'Development',
				'role': 'Lead Developer - Back End',
				'jobFamily': 'Development Back-end',
				'level': 'Lead',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '90.00' }],
				'location': null
			}, {
				'id': 1131,
				'code': 'DEV-BAC-04',
				'category': 'Development',
				'role': 'Lead Developer - Back End',
				'jobFamily': 'Development Back-end',
				'level': 'Lead',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '122.00' }],
				'location': null
			}, {
				'id': 1132,
				'code': 'DEV-BAC-04',
				'category': 'Development',
				'role': 'Senior Developer - Back End',
				'jobFamily': 'Development Back-end',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '145.00' }],
				'location': null
			}, {
				'id': 1133,
				'code': 'DEV-BAC-04',
				'category': 'Development',
				'role': 'Senior Developer - Back End',
				'jobFamily': 'Development Back-end',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '145.00' }],
				'location': null
			}, {
				'id': 1134,
				'code': 'DEV-BAC-04',
				'category': 'Development',
				'role': 'Senior Developer - Back End',
				'jobFamily': 'Development Back-end',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '85.00' }],
				'location': null
			}, {
				'id': 1135,
				'code': 'DEV-BAC-04',
				'category': 'Development',
				'role': 'Senior Developer - Back End',
				'jobFamily': 'Development Back-end',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '111.00' }],
				'location': null
			}, {
				'id': 1136,
				'code': 'DEV-BAC-03',
				'category': 'Development',
				'role': 'Developer - Back End',
				'jobFamily': 'Development Back-end',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '120.00' }],
				'location': null
			}, {
				'id': 1137,
				'code': 'DEV-BAC-03',
				'category': 'Development',
				'role': 'Developer - Back End',
				'jobFamily': 'Development Back-end',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '120.00' }],
				'location': null
			}, {
				'id': 1138,
				'code': 'DEV-BAC-03',
				'category': 'Development',
				'role': 'Developer - Back End',
				'jobFamily': 'Development Back-end',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '75.00' }],
				'location': null
			}, {
				'id': 1139,
				'code': 'DEV-BAC-03',
				'category': 'Development',
				'role': 'Developer - Back End',
				'jobFamily': 'Development Back-end',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '78.00' }],
				'location': null
			}, {
				'id': 1140,
				'code': 'DEV-BAC-03',
				'category': 'Development',
				'role': 'Development Manager - Back End',
				'jobFamily': 'Development Back-end',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '130.00' }],
				'location': null
			}, {
				'id': 1141,
				'code': 'DEV-BAC-03',
				'category': 'Development',
				'role': 'Development Manager - Back End',
				'jobFamily': 'Development Back-end',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '130.00' }],
				'location': null
			}, {
				'id': 1142,
				'code': 'DEV-BAC-03',
				'category': 'Development',
				'role': 'Development Manager - Back End',
				'jobFamily': 'Development Back-end',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '75.00' }],
				'location': null
			}, {
				'id': 1143,
				'code': 'DEV-BAC-03',
				'category': 'Development',
				'role': 'Development Manager - Back End',
				'jobFamily': 'Development Back-end',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '118.00' }],
				'location': null
			}, {
				'id': 1144,
				'code': 'DEV-CRT-04',
				'category': 'Development',
				'role': 'Lead Developer - DM',
				'jobFamily': 'Development Creative Technology',
				'level': 'Lead',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '110.00' }],
				'location': null
			}, {
				'id': 1145,
				'code': 'DEV-CRT-04',
				'category': 'Development',
				'role': 'Lead Developer - DM',
				'jobFamily': 'Development Creative Technology',
				'level': 'Lead',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '110.00' }],
				'location': null
			}, {
				'id': 1146,
				'code': 'DEV-CRT-04',
				'category': 'Development',
				'role': 'Lead Developer - DM',
				'jobFamily': 'Development Creative Technology',
				'level': 'Lead',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '85.00' }],
				'location': null
			}, {
				'id': 1147,
				'code': 'DEV-CRT-04',
				'category': 'Development',
				'role': 'Lead Developer - DM',
				'jobFamily': 'Development Creative Technology',
				'level': 'Lead',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '122.00' }],
				'location': null
			}, {
				'id': 1148,
				'code': 'DEV-FUN-04',
				'category': 'QA',
				'role': 'Senior Developer - DM',
				'jobFamily': 'Development Functional QA',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '105.00' }],
				'location': null
			}, {
				'id': 1149,
				'code': 'DEV-FUN-04',
				'category': 'QA',
				'role': 'Senior Developer - DM',
				'jobFamily': 'Development Functional QA',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '105.00' }],
				'location': null
			}, {
				'id': 1150,
				'code': 'DEV-FUN-04',
				'category': 'QA',
				'role': 'Senior Developer - DM',
				'jobFamily': 'Development Functional QA',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '85.00' }],
				'location': null
			}, {
				'id': 1151,
				'code': 'DEV-FUN-04',
				'category': 'QA',
				'role': 'Senior Developer - DM',
				'jobFamily': 'Development Functional QA',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '101.00' }],
				'location': null
			}, {
				'id': 1152,
				'code': 'DEV-FUN-03',
				'category': 'QA',
				'role': 'Developer - DM',
				'jobFamily': 'Development Functional QA',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '100.00' }],
				'location': null
			}, {
				'id': 1153,
				'code': 'DEV-FUN-03',
				'category': 'QA',
				'role': 'Developer - DM',
				'jobFamily': 'Development Functional QA',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '100.00' }],
				'location': null
			}, {
				'id': 1154,
				'code': 'DEV-FUN-03',
				'category': 'QA',
				'role': 'Developer - DM',
				'jobFamily': 'Development Functional QA',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '80.00' }],
				'location': null
			}, {
				'id': 1155,
				'code': 'DEV-FUN-03',
				'category': 'QA',
				'role': 'Developer - DM',
				'jobFamily': 'Development Functional QA',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '85.00' }],
				'location': null
			}, {
				'id': 1156,
				'code': 'DEV-FUN-03',
				'category': 'QA',
				'role': 'Tester - QA',
				'jobFamily': 'Development Functional QA',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '100.00' }],
				'location': null
			}, {
				'id': 1157,
				'code': 'DEV-FUN-03',
				'category': 'QA',
				'role': 'Tester - QA',
				'jobFamily': 'Development Functional QA',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '100.00' }],
				'location': null
			}, {
				'id': 1158,
				'code': 'DEV-FUN-03',
				'category': 'QA',
				'role': 'Tester - QA',
				'jobFamily': 'Development Functional QA',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '75.00' }],
				'location': null
			}, {
				'id': 1159,
				'code': 'DEV-FUN-03',
				'category': 'QA',
				'role': 'Tester - QA',
				'jobFamily': 'Development Functional QA',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '74.00' }],
				'location': null
			}, {
				'id': 1160,
				'code': 'DEV-FUN-04',
				'category': 'QA',
				'role': 'Lead Tester - QA',
				'jobFamily': 'Development Functional QA',
				'level': 'Lead',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '123.00' }],
				'location': null
			}, {
				'id': 1161,
				'code': 'DEV-FUN-04',
				'category': 'QA',
				'role': 'Lead Tester - QA',
				'jobFamily': 'Development Functional QA',
				'level': 'Lead',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '118.00' }],
				'location': null
			}, {
				'id': 1162,
				'code': 'DEV-FUN-04',
				'category': 'QA',
				'role': 'Lead Tester - QA',
				'jobFamily': 'Development Functional QA',
				'level': 'Lead',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '77.00' }],
				'location': null
			}, {
				'id': 1163,
				'code': 'DEV-FUN-04',
				'category': 'QA',
				'role': 'Lead Tester - QA',
				'jobFamily': 'Development Functional QA',
				'level': 'Lead',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '79.00' }],
				'location': null
			}, {
				'id': 1164,
				'code': 'DEV-FUN-03',
				'category': 'QA',
				'role': 'QE - Back End',
				'jobFamily': 'Development Functional QA',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '100.00' }],
				'location': null
			}, {
				'id': 1165,
				'code': 'DEV-FUN-03',
				'category': 'QA',
				'role': 'QE - Back End',
				'jobFamily': 'Development Functional QA',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '100.00' }],
				'location': null
			}, {
				'id': 1166,
				'code': 'DEV-FUN-03',
				'category': 'QA',
				'role': 'QE - Back End',
				'jobFamily': 'Development Functional QA',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '75.00' }],
				'location': null
			}, {
				'id': 1167,
				'code': 'DEV-FUN-03',
				'category': 'QA',
				'role': 'QE - Back End',
				'jobFamily': 'Development Functional QA',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '88.00' }],
				'location': null
			}, {
				'id': 1168,
				'code': 'DEV-FUN-04',
				'category': 'QA',
				'role': 'Lead Tester - QE',
				'jobFamily': 'Development Functional QA',
				'level': 'Lead',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '110.00' }],
				'location': null
			}, {
				'id': 1169,
				'code': 'DEV-FUN-04',
				'category': 'QA',
				'role': 'Lead Tester - QE',
				'jobFamily': 'Development Functional QA',
				'level': 'Lead',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '110.00' }],
				'location': null
			}, {
				'id': 1170,
				'code': 'DEV-FUN-04',
				'category': 'QA',
				'role': 'Lead Tester - QE',
				'jobFamily': 'Development Functional QA',
				'level': 'Lead',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '77.00' }],
				'location': null
			}, {
				'id': 1171,
				'code': 'DEV-FUN-04',
				'category': 'QA',
				'role': 'Lead Tester - QE',
				'jobFamily': 'Development Functional QA',
				'level': 'Lead',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '111.00' }],
				'location': null
			}, {
				'id': 1172,
				'code': 'CRE-EDI-02',
				'category': 'Post Production',
				'role': 'Junior Colorist',
				'jobFamily': 'Creative Editing',
				'level': 'Junior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '180.00' }],
				'location': null
			}, {
				'id': 1173,
				'code': 'CRE-EDI-03',
				'category': 'Post Production',
				'role': 'Colorist',
				'jobFamily': 'Creative Editing',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '300.00' }],
				'location': null
			}, {
				'id': 1174,
				'code': 'CRE-EDI-04',
				'category': 'Post Production',
				'role': 'Senior Colorist',
				'jobFamily': 'Creative Editing',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '300.00' }],
				'location': null
			}, {
				'id': 1175,
				'code': 'CRE-SOS-04',
				'category': 'Post Production',
				'role': 'Senior Sound Designer',
				'jobFamily': 'Creative Sound',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '150.00' }],
				'location': null
			}, {
				'id': 1176,
				'code': 'CRE-SOS-04',
				'category': 'Post Production',
				'role': 'Senior Sound Designer',
				'jobFamily': 'Creative Sound',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '110.00' }],
				'location': null
			}, {
				'id': 1177,
				'code': 'CRE-SOS-04',
				'category': 'Post Production',
				'role': 'Senior Sound Designer',
				'jobFamily': 'Creative Sound',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '45.00' }],
				'location': null
			}, {
				'id': 1178,
				'code': 'CRE-EDI-03',
				'category': 'Post Production',
				'role': 'Video Editor / AV',
				'jobFamily': 'Creative Editing',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '121.00' }],
				'location': null
			}, {
				'id': 1179,
				'code': 'CRE-EDI-03',
				'category': 'Post Production',
				'role': 'Video Editor / AV',
				'jobFamily': 'Creative Editing',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '42.00' }],
				'location': null
			}, {
				'id': 1180,
				'code': 'CRE-EDI-03',
				'category': 'Post Production',
				'role': 'Online Editor',
				'jobFamily': 'Creative Editing',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '275.00' }],
				'location': null
			}, {
				'id': 1181,
				'code': 'CRE-EDI-03',
				'category': 'Post Production',
				'role': 'Online Editor',
				'jobFamily': 'Creative Editing',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '89.00' }],
				'location': null
			}, {
				'id': 1182,
				'code': 'CRE-EDI-03',
				'category': 'Post Production',
				'role': 'Online Editor',
				'jobFamily': 'Creative Editing',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '89.00' }],
				'location': null
			}, {
				'id': 1183,
				'code': 'CRE-EDI-03',
				'category': 'Post Production',
				'role': 'Online Editor',
				'jobFamily': 'Creative Editing',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '91.00' }],
				'location': null
			}, {
				'id': 1184,
				'code': 'CRE-EDI-03',
				'category': 'Post Production',
				'role': 'Offline Editor',
				'jobFamily': 'Creative Editing',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '250.00' }],
				'location': null
			}, {
				'id': 1185,
				'code': 'CRE-EDI-03',
				'category': 'Post Production',
				'role': 'Offline Editor',
				'jobFamily': 'Creative Editing',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '122.00' }],
				'location': null
			}, {
				'id': 1186,
				'code': 'CRE-EDI-03',
				'category': 'Post Production',
				'role': 'Offline Editor',
				'jobFamily': 'Creative Editing',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '100.00' }],
				'location': null
			}, {
				'id': 1187,
				'code': 'CRE-EDI-03',
				'category': 'Post Production',
				'role': 'Offline Editor',
				'jobFamily': 'Creative Editing',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '61.00' }],
				'location': null
			}, {
				'id': 1188,
				'code': 'CRE-EDI-03',
				'category': 'Post Production',
				'role': 'VFX Compositor',
				'jobFamily': 'Creative Editing',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '350.00' }],
				'location': null
			}, {
				'id': 1189,
				'code': 'CRE-EDI-03',
				'category': 'Post Production',
				'role': 'VFX Compositor',
				'jobFamily': 'Creative Editing',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '214.00' }],
				'location': null
			}, {
				'id': 1190,
				'code': 'CRE-EDI-03',
				'category': 'Post Production',
				'role': 'VFX Compositor',
				'jobFamily': 'Creative Editing',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '98.00' }],
				'location': null
			}, {
				'id': 1191,
				'code': 'CRE-EDI-04',
				'category': 'Post Production',
				'role': 'Senior Photo Retoucher',
				'jobFamily': 'Creative Editing',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '130.00' }],
				'location': null
			}, {
				'id': 1192,
				'code': 'CRE-EDI-04',
				'category': 'Post Production',
				'role': 'Senior Photo Retoucher',
				'jobFamily': 'Creative Editing',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '130.00' }],
				'location': null
			}, {
				'id': 1193,
				'code': 'CRE-EDI-04',
				'category': 'Post Production',
				'role': 'Senior Photo Retoucher',
				'jobFamily': 'Creative Editing',
				'level': 'Senior',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '80.00' }],
				'location': null
			}, {
				'id': 1194,
				'code': 'CRE-EDI-03',
				'category': 'Post Production',
				'role': 'Photo Retoucher',
				'jobFamily': 'Creative Editing',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '125.00' }],
				'location': null
			}, {
				'id': 1195,
				'code': 'CRE-EDI-03',
				'category': 'Post Production',
				'role': 'Photo Retoucher',
				'jobFamily': 'Creative Editing',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '125.00' }],
				'location': null
			}, {
				'id': 1196,
				'code': 'CRE-EDI-03',
				'category': 'Post Production',
				'role': 'Photo Retoucher',
				'jobFamily': 'Creative Editing',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '80.00' }],
				'location': null
			}, {
				'id': 1197,
				'code': 'CON-PRO-06',
				'category': 'Content Production',
				'role': 'Session Director',
				'jobFamily': 'Content Production / Coordination',
				'level': 'Director',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '220.00' }],
				'location': null
			}, {
				'id': 1198,
				'code': 'CON-PRO-03',
				'category': 'Content Production',
				'role': 'Proofreader',
				'jobFamily': 'Content Production / Coordination',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '60.00' }],
				'location': null
			}, {
				'id': 1199,
				'code': 'CON-PRO-03',
				'category': 'Content Production',
				'role': 'Creative Technologist',
				'jobFamily': 'Content Production / Coordination',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '255.00' }],
				'location': null
			}, {
				'id': 1200,
				'code': 'CON-PRO-03',
				'category': 'Content Production',
				'role': 'Creative Technologist',
				'jobFamily': 'Content Production / Coordination',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '176.00' }],
				'location': null
			}, {
				'id': 1201,
				'code': 'CON-PRO-03',
				'category': 'Content Production',
				'role': 'Creative Technologist',
				'jobFamily': 'Content Production / Coordination',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '60.00' }],
				'location': null
			}, {
				'id': 1202,
				'code': 'CON-PRO-03',
				'category': 'Content Production',
				'role': 'Pipeline Engineer',
				'jobFamily': 'Content Production / Coordination',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '240.00' }],
				'location': null
			}, {
				'id': 1203,
				'code': 'CON-PRO-03',
				'category': 'Content Production',
				'role': 'Pipeline Engineer',
				'jobFamily': 'Content Production / Coordination',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '182.00' }],
				'location': null
			}, {
				'id': 1204,
				'code': 'CON-PRO-03',
				'category': 'Content Production',
				'role': 'Pipeline Engineer',
				'jobFamily': 'Content Production / Coordination',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '75.00' }],
				'location': null
			}, {
				'id': 1205,
				'code': 'CRE-VQA-03',
				'category': 'Content Production',
				'role': 'Quality Assurance',
				'jobFamily': 'Creative Visual QA',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '135.00' }],
				'location': null
			}, {
				'id': 1206,
				'code': 'CRE-VQA-03',
				'category': 'Content Production',
				'role': 'Quality Assurance',
				'jobFamily': 'Creative Visual QA',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '59.00' }],
				'location': null
			}, {
				'id': 1207,
				'code': 'CRE-VQA-03',
				'category': 'Content Production',
				'role': 'Quality Assurance',
				'jobFamily': 'Creative Visual QA',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '55.00' }],
				'location': null
			}, {
				'id': 1208,
				'code': 'CRE-VQA-03',
				'category': 'Content Production',
				'role': 'Quality Assurance',
				'jobFamily': 'Creative Visual QA',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '40.00' }],
				'location': null
			}, {
				'id': 1209,
				'code': 'CON-PRO-03',
				'category': 'Content Production',
				'role': 'Asset Editor',
				'jobFamily': 'Content Production / Coordination',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '60.00' }],
				'location': null
			}, {
				'id': 1210,
				'code': 'CON-PRO-03',
				'category': 'Content Production',
				'role': 'Ingest Engineer',
				'jobFamily': 'Content Production / Coordination',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '112.00' }],
				'location': null
			}, {
				'id': 1211,
				'code': 'CON-PRO-03',
				'category': 'Content Production',
				'role': 'Ingest Engineer',
				'jobFamily': 'Content Production / Coordination',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '72.00' }],
				'location': null
			}, {
				'id': 1212,
				'code': 'CON-PRO-03',
				'category': 'Content Production',
				'role': 'Ingest Engineer',
				'jobFamily': 'Content Production / Coordination',
				'level': 'Mid',
				'marketRates': [{ 'market': 'USA', 'currency': 'USD', 'rate': '57.00' }],
				'location': null
			}]
		},
		'deliverables': [{
			'deliverable': 'update image',
			'number': 15,
			'client_name': '',
			'asset_name': 'A',
			'asset_type': 'Retouching',
			'placement': '',
			'duration': '',
			'creative_base': 'Adaptation of an existing visual',
			'changes_needed_on_creative_base': '',
			'asset_copy': '',
			'technical_specifications': '16:9',
			'channel': '',
			'delivery_deadline': 45915
		}, {
			'deliverable': 'update image',
			'number': 8,
			'client_name': '',
			'asset_name': 'A',
			'asset_type': 'Retouching',
			'placement': '',
			'duration': '',
			'creative_base': 'Adaptation of an existing visual',
			'changes_needed_on_creative_base': '',
			'asset_copy': '',
			'technical_specifications': '16:9',
			'channel': '',
			'delivery_deadline': 45930
		}],
		'historicalTimelinesFolderId': '1eOUrSIoHibCviWCDZt82HazReq6f0PXI',
		'gaps': ['The specific content or update required for the 15 images is not defined.', 'The source assets or reference material for the 15 update images are not provided.', 'The exact dates for \'mid September\' and \'end September\' are not specified.'],
		'additionalInfo': ['empty', 'empty']
	});
	
	// await invoke({
	// 	"config": {
	// 		"output": [
	// 			"finalQuote"
	// 		]
	// 	},
	// 	"quoteData": [
	// 		{
	// 			"Asset": "OLV video adaptation",
	// 			"Client name": "N/A",
	// 			"Platform": "N/A",
	// 			"Primary Tier": "Medium",
	// 			"Primary Rate (USD)": 149,
	// 			"Primary Reasoning": "Based on the rate card, this is a 'TECH ADAPT' for 1 x OLV.",
	// 			"Alternate Tier": "Medium",
	// 			"Alternate Rate (USD)": 149,
	// 			"Alternate Reasoning": "Assuming that the source file is provided."
	// 		},
	// 		{
	// 			"Asset": "FB In Feed Video adaptation",
	// 			"Client name": "N/A",
	// 			"Platform": "N/A",
	// 			"Primary Tier": "Medium",
	// 			"Primary Rate (USD)": 166,
	// 			"Primary Reasoning": "Based on the rate card, this is a 'TECH ADAPT' for 1 x FB In Feed Video.",
	// 			"Alternate Tier": "Medium",
	// 			"Alternate Rate (USD)": 166,
	// 			"Alternate Reasoning": "Assuming that the source file is provided."
	// 		},
	// 		{
	// 			"Asset": "GIF to video conversion",
	// 			"Client name": "N/A",
	// 			"Platform": "N/A",
	// 			"Primary Tier": "Medium",
	// 			"Primary Rate (USD)": 89,
	// 			"Primary Reasoning": "Based on the rate card, this is a 'TECH ADAPT' for 1 x Static image, GIF.",
	// 			"Alternate Tier": "Medium",
	// 			"Alternate Rate (USD)": 89,
	// 			"Alternate Reasoning": "Assuming that the source file is provided."
	// 		},
	// 		{
	// 			"Asset": "Banner adaptation for another platform",
	// 			"Client name": "N/A",
	// 			"Platform": "N/A",
	// 			"Primary Tier": "Medium",
	// 			"Primary Rate (USD)": 168,
	// 			"Primary Reasoning": "Based on the rate card, this is a 'TECH ADAPT' for 1 x Display banner HTML5, DCM.",
	// 			"Alternate Tier": "Medium",
	// 			"Alternate Rate (USD)": 168,
	// 			"Alternate Reasoning": "Assuming that the source file is provided."
	// 		}
	// 	],
	// 	"timelineData": [
	// 		{
	// 			"Activity": "Intake & Briefing",
	// 			"Owner": "GM",
	// 			"Start Week": 1,
	// 			"End Week": 2,
	// 			"Duration (Weeks)": 1
	// 		},
	// 		{
	// 			"Activity": "Asset Preparation & Retouching",
	// 			"Owner": "Monks",
	// 			"Start Week": 2,
	// 			"End Week": 4,
	// 			"Duration (Weeks)": 2
	// 		},
	// 		{
	// 			"Activity": "Internal Review & QA",
	// 			"Owner": "Monks",
	// 			"Start Week": 4,
	// 			"End Week": 5,
	// 			"Duration (Weeks)": 1
	// 		},
	// 		{
	// 			"Activity": "Client Review & Feedback",
	// 			"Owner": "GM",
	// 			"Start Week": 5,
	// 			"End Week": 6,
	// 			"Duration (Weeks)": 1
	// 		},
	// 		{
	// 			"Activity": "Retouching Revisions",
	// 			"Owner": "Monks",
	// 			"Start Week": 6,
	// 			"End Week": 7,
	// 			"Duration (Weeks)": 1
	// 		},
	// 		{
	// 			"Activity": "Final QA",
	// 			"Owner": "Monks",
	// 			"Start Week": 7,
	// 			"End Week": 8,
	// 			"Duration (Weeks)": 1
	// 		},
	// 		{
	// 			"Activity": "Delivery to GMAC",
	// 			"Owner": "Monks",
	// 			"Start Week": 8,
	// 			"End Week": 9,
	// 			"Duration (Weeks)": 1
	// 		}
	// 	],
	// 	"finalQuoteExampleId": "1dq_UMdmKKvCTuaYE3Ro5n__lYCpfy-s2",
	// 	"additionalInfo": "",
	// 	"startDate": "20250101",
	// 	"endDate": "20250308"
	// });
	
}());
