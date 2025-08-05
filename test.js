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
	// 	'config': { 'output': ['followUp', 'outputDeliverables', 'validatedCriticalProductionBlockers', 'validatedImportantClarifications', 'validatedBriefInconsistencies'] },
	// 	'briefFolderId': '1a2_DTNuBIfTFb8Spi6FnQWEt1abTzwgw',
	// 	'outputFolderId': '1ew_B-BlwD_bCytp9NiJ_VJ5qcYRCazAE',
	// 	'additionalInfo': [],
	// 	'now': '2025-07-30T09:52:23.637Z'
	// });
	
	await invoke({
		"config": {
			"output": [
				"outputQuote",
				"outputTimeline"
			]
		},
		"ratecardData": {
			name: "General Motors Rate Card",
			data: [
				{
					"id": 1966,
					"code": "NO-JOBFAMILY-00-US",
					"category": "TV Spot",
					"role": "Very Simple TV Spot",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "145.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 1967,
					"code": "NO-JOBFAMILY-00-US",
					"category": "TV Spot",
					"role": "Simple TV Spot",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "194.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 1968,
					"code": "NO-JOBFAMILY-00-US",
					"category": "TV Spot",
					"role": "Medium TV Spot",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "324.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 1969,
					"code": "NO-JOBFAMILY-00-US",
					"category": "TV Spot",
					"role": "Complex TV Spot",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "902.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 1970,
					"code": "NO-JOBFAMILY-00-US",
					"category": "TV Spot",
					"role": "Revision -  Very Simple TV Spot",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "22.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 1971,
					"code": "NO-JOBFAMILY-00-US",
					"category": "TV Spot",
					"role": "Revision -  Simple TV Spot",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "29.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 1972,
					"code": "NO-JOBFAMILY-00-US",
					"category": "TV Spot",
					"role": "Revision - Medium TV Spot",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "49.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 1973,
					"code": "NO-JOBFAMILY-00-US",
					"category": "TV Spot",
					"role": "Revision - Complex TV Spot",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "135.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 1974,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Radio Spot",
					"role": "Very Simple Radio Spot",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "183.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 1975,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Radio Spot",
					"role": "Simple Radio Spot",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "276.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 1976,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Radio Spot",
					"role": "Medium Radio Spot",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "427.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 1977,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Radio Spot",
					"role": "Complex Radio Spot",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "611.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 1978,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Radio Spot",
					"role": "Revision -  Very Simple Radio Spot",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "27.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 1979,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Radio Spot",
					"role": "Revision -  Simple Radio Spot",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "41.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 1980,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Radio Spot",
					"role": "Revision - Medium Radio Spot",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "64.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 1981,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Radio Spot",
					"role": "Revision - Complex Radio Spot",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "92.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 1982,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Subtitling",
					"role": "Simple Subtitling",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "101.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 1983,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Subtitling",
					"role": "Complex Subtitling",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "216.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 1984,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Print\/Out of Home",
					"role": "Very Simple Print\/Out of Home",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "79.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 1985,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Print\/Out of Home",
					"role": "Simple Print\/Out of Home",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "143.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 1986,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Print\/Out of Home",
					"role": "Medium Print\/Out of Home",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "167.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 1987,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Print\/Out of Home",
					"role": "Complex Print\/Out of Home",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "370.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 1988,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Print\/Out of Home",
					"role": "Revision -  Very Simple Print\/Out of Home",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "12.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 1989,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Print\/Out of Home",
					"role": "Revision -  Simple Print\/Out of Home",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "21.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 1990,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Print\/Out of Home",
					"role": "Revision - Medium Print\/Out of Home",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "25.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 1991,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Print\/Out of Home",
					"role": "Revision - Complex Print\/Out of Home",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "56.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 1992,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Point of Sale",
					"role": "Very Simple Point of Sale",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "79.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 1993,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Point of Sale",
					"role": "Simple Point of Sale",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "191.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 1994,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Point of Sale",
					"role": "Medium Point of Sale",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "191.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 1995,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Point of Sale",
					"role": "Complex Point of Sale",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "296.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 1996,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Point of Sale",
					"role": "Revision - Very Simple Point of Sale",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "12.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 1997,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Point of Sale",
					"role": "Revision -  Simple Point of Sale",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "29.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 1998,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Point of Sale",
					"role": "Revision - Medium Point of Sale",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "29.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 1999,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Point of Sale",
					"role": "Revision - Complex Point of Sale",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "44.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2000,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Saver Sheet\/ Hero Card",
					"role": "Very Simple Saver Sheet\/ Hero Card",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "110.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2001,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Saver Sheet\/ Hero Card",
					"role": "Simple Saver Sheet\/ Hero Card",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "153.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2002,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Saver Sheet\/ Hero Card",
					"role": "Medium Saver Sheet\/ Hero Card",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "191.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2003,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Saver Sheet\/ Hero Card",
					"role": "Complex Saver Sheet\/ Hero Card",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "296.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2004,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Saver Sheet\/ Hero Card",
					"role": "Revision - Very Simple Saver Sheet\/ Hero Card",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "16.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2005,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Saver Sheet\/ Hero Card",
					"role": "Revision -  Simple Saver Sheet\/ Hero Card",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "23.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2006,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Saver Sheet\/ Hero Card",
					"role": "Revision - Medium Saver Sheet\/ Hero Card",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "29.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2007,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Saver Sheet\/ Hero Card",
					"role": "Revision - Complex Saver Sheet\/ Hero Card",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "44.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2008,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Catalogs",
					"role": "Very Simple Catalogs",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "66.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2009,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Catalogs",
					"role": "Simple Catalogs",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "191.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2010,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Catalogs",
					"role": "Medium Catalogs",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "239.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2011,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Catalogs",
					"role": "Complex Catalogs",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "518.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2012,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Catalogs",
					"role": "Revision - Very Simple Catalogs",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "10.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2013,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Catalogs",
					"role": "Revision -  Simple Catalogs",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "29.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2014,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Catalogs",
					"role": "Revision - Medium Catalogs",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "36.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2015,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Catalogs",
					"role": "Revision - Complex Catalogs",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "78.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2016,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Retouching",
					"role": "Offshore Retouching",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "191.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2017,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Retouching",
					"role": "Onshore Retouching",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "376.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2018,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Web Feature Content",
					"role": "Simple Web Feature Content",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "196.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2019,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Web Feature Content",
					"role": "Medium Web Feature Content",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "295.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2020,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Web Feature Content",
					"role": "Complex Web Feature Content",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "677.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2021,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Web Feature Content",
					"role": "Revision -  Simple Web Feature Content",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "29.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2022,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Web Feature Content",
					"role": "Revision - Medium Web Feature Content",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "44.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2023,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Web Feature Content",
					"role": "Revision - Complex Web Feature Content",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "101.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2024,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Online Vehicle Page",
					"role": "Simple Online Vehicle Page",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "191.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2025,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Online Vehicle Page",
					"role": "Medium Online Vehicle Page",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "286.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2026,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Online Vehicle Page",
					"role": "Complex Online Vehicle Page",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "942.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2027,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Online Vehicle Page",
					"role": "Revision -  Simple Online Vehicle Page",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "29.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2028,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Online Vehicle Page",
					"role": "Revision - Medium Online Vehicle Page",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "43.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2029,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Online Vehicle Page",
					"role": "Revision - Complex Online Vehicle Page",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "141.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2030,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Mobile Site Page",
					"role": "Simple Mobile Site Page",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "191.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2031,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Mobile Site Page",
					"role": "Medium Mobile Site Page",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "286.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2032,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Mobile Site Page",
					"role": "Complex Mobile Site Page",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "946.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2033,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Mobile Site Page",
					"role": "Revision -  Simple Mobile Site Page",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "29.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2034,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Mobile Site Page",
					"role": "Revision - Medium Mobile Site Page",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "43.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2035,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Mobile Site Page",
					"role": "Revision - Complex Mobile Site Page",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "142.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2036,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Standard Banner",
					"role": "Simple Standard Banner",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "72.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2037,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Standard Banner",
					"role": "Medium Standard Banner",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "143.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2038,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Standard Banner",
					"role": "Complex Standard Banner",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "516.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2039,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Standard Banner",
					"role": "Revision -  Simple Standard Banner",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "11.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2040,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Standard Banner",
					"role": "Revision - Medium Standard Banner",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "21.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2041,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Standard Banner",
					"role": "Revision - Complex Standard Banner",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "77.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2042,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Rich Media Banner",
					"role": "Simple Rich Media Banner",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "119.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2043,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Rich Media Banner",
					"role": "Medium Rich Media Banner",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "191.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2044,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Rich Media Banner",
					"role": "Complex Rich Media Banner",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "688.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2045,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Rich Media Banner",
					"role": "Revision -  Simple Rich Media Banner",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "18.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2046,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Rich Media Banner",
					"role": "Revision - Medium Rich Media Banner",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "29.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2047,
					"code": "NO-JOBFAMILY-00-US",
					"category": "Rich Media Banner",
					"role": "Revision - Complex Rich Media Banner",
					"jobFamily": {
						"group": "No FTE",
						"groupCode": "NO",
						"name": "No job family applicable",
						"code": "JOBFAMILY",
						"combined": "No FTE | No job family applicable",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 12,
						"name": "No FTE - No Level",
						"code": 0
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "103.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2048,
					"code": "BUS-ACM-08-US",
					"category": "Account Management",
					"role": "Head of Account Management",
					"jobFamily": {
						"group": "Business",
						"groupCode": "BUS",
						"name": "Account Management",
						"code": "ACM",
						"combined": "Business | Account Management",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 9,
						"name": "VP",
						"code": 8
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "350"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2049,
					"code": "BUS-ACM-08-EMEA",
					"category": "Account Management",
					"role": "Head of Account Management",
					"jobFamily": {
						"group": "Business",
						"groupCode": "BUS",
						"name": "Account Management",
						"code": "ACM",
						"combined": "Business | Account Management",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 9,
						"name": "VP",
						"code": 8
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "195.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2050,
					"code": "BUS-ACM-08-LATAM",
					"category": "Account Management",
					"role": "Head of Account Management",
					"jobFamily": {
						"group": "Business",
						"groupCode": "BUS",
						"name": "Account Management",
						"code": "ACM",
						"combined": "Business | Account Management",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 9,
						"name": "VP",
						"code": 8
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "88.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2051,
					"code": "BUS-ACM-07-US",
					"category": "Account Management",
					"role": "Group Account Director",
					"jobFamily": {
						"group": "Business",
						"groupCode": "BUS",
						"name": "Account Management",
						"code": "ACM",
						"combined": "Business | Account Management",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 8,
						"name": "Senior Director",
						"code": 7
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "275.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2052,
					"code": "BUS-ACM-07-LATAM",
					"category": "Account Management",
					"role": "Group Account Director",
					"jobFamily": {
						"group": "Business",
						"groupCode": "BUS",
						"name": "Account Management",
						"code": "ACM",
						"combined": "Business | Account Management",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 8,
						"name": "Senior Director",
						"code": 7
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "86.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2053,
					"code": "BUS-ACM-05-US",
					"category": "Account Management",
					"role": "Associate Group Account Director",
					"jobFamily": {
						"group": "Business",
						"groupCode": "BUS",
						"name": "Account Management",
						"code": "ACM",
						"combined": "Business | Account Management",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 6,
						"name": "Associate Director",
						"code": 5
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "250.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2054,
					"code": "BUS-ACM-04-US",
					"category": "Account Management",
					"role": "Senior Account Director",
					"jobFamily": {
						"group": "Business",
						"groupCode": "BUS",
						"name": "Account Management",
						"code": "ACM",
						"combined": "Business | Account Management",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "225.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2055,
					"code": "BUS-ACM-04-EMEA",
					"category": "Account Management",
					"role": "Senior Account Director",
					"jobFamily": {
						"group": "Business",
						"groupCode": "BUS",
						"name": "Account Management",
						"code": "ACM",
						"combined": "Business | Account Management",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "170.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2056,
					"code": "BUS-ACM-06-US",
					"category": "Account Management",
					"role": "Account Director",
					"jobFamily": {
						"group": "Business",
						"groupCode": "BUS",
						"name": "Account Management",
						"code": "ACM",
						"combined": "Business | Account Management",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 7,
						"name": "Director",
						"code": 6
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "200.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2057,
					"code": "BUS-ACM-06-EMEA",
					"category": "Account Management",
					"role": "Account Director",
					"jobFamily": {
						"group": "Business",
						"groupCode": "BUS",
						"name": "Account Management",
						"code": "ACM",
						"combined": "Business | Account Management",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 7,
						"name": "Director",
						"code": 6
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "119.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2058,
					"code": "BUS-ACM-06-LATAM",
					"category": "Account Management",
					"role": "Account Director",
					"jobFamily": {
						"group": "Business",
						"groupCode": "BUS",
						"name": "Account Management",
						"code": "ACM",
						"combined": "Business | Account Management",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 7,
						"name": "Director",
						"code": 6
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "82.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2059,
					"code": "BUS-ACM-04-US",
					"category": "Account Management",
					"role": "Senior Account Manager",
					"jobFamily": {
						"group": "Business",
						"groupCode": "BUS",
						"name": "Account Management",
						"code": "ACM",
						"combined": "Business | Account Management",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "160.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2060,
					"code": "BUS-ACM-04-EMEA",
					"category": "Account Management",
					"role": "Senior Account Manager",
					"jobFamily": {
						"group": "Business",
						"groupCode": "BUS",
						"name": "Account Management",
						"code": "ACM",
						"combined": "Business | Account Management",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "85.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2061,
					"code": "BUS-ACM-04-LATAM",
					"category": "Account Management",
					"role": "Senior Account Manager",
					"jobFamily": {
						"group": "Business",
						"groupCode": "BUS",
						"name": "Account Management",
						"code": "ACM",
						"combined": "Business | Account Management",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "71.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2062,
					"code": "BUS-ACM-03-US",
					"category": "Account Management",
					"role": "Account Manager",
					"jobFamily": {
						"group": "Business",
						"groupCode": "BUS",
						"name": "Account Management",
						"code": "ACM",
						"combined": "Business | Account Management",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "125.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2063,
					"code": "BUS-ACM-03-EMEA",
					"category": "Account Management",
					"role": "Account Manager",
					"jobFamily": {
						"group": "Business",
						"groupCode": "BUS",
						"name": "Account Management",
						"code": "ACM",
						"combined": "Business | Account Management",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "75.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2064,
					"code": "BUS-ACM-03-LATAM",
					"category": "Account Management",
					"role": "Account Manager",
					"jobFamily": {
						"group": "Business",
						"groupCode": "BUS",
						"name": "Account Management",
						"code": "ACM",
						"combined": "Business | Account Management",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "69.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2065,
					"code": "BUS-ACM-02-US",
					"category": "Account Management",
					"role": "Associate Account Manager",
					"jobFamily": {
						"group": "Business",
						"groupCode": "BUS",
						"name": "Account Management",
						"code": "ACM",
						"combined": "Business | Account Management",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 2,
						"name": "Junior",
						"code": 2
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "110.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2066,
					"code": "BUS-ACM-02-EMEA",
					"category": "Account Management",
					"role": "Associate Account Manager",
					"jobFamily": {
						"group": "Business",
						"groupCode": "BUS",
						"name": "Account Management",
						"code": "ACM",
						"combined": "Business | Account Management",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 2,
						"name": "Junior",
						"code": 2
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "52.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2067,
					"code": "BUS-ACM-02-LATAM",
					"category": "Account Management",
					"role": "Associate Account Manager",
					"jobFamily": {
						"group": "Business",
						"groupCode": "BUS",
						"name": "Account Management",
						"code": "ACM",
						"combined": "Business | Account Management",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 2,
						"name": "Junior",
						"code": 2
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "62.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2068,
					"code": "CON-PRO-04-US",
					"category": "Delivery",
					"role": "Executive Producer",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Production \/ Coordination",
						"code": "PRO",
						"combined": "Content | Production \/ Coordination",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 5,
						"name": "Lead",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "190.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2069,
					"code": "CON-PRO-04-EMEA",
					"category": "Delivery",
					"role": "Executive Producer",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Production \/ Coordination",
						"code": "PRO",
						"combined": "Content | Production \/ Coordination",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 5,
						"name": "Lead",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "175.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2070,
					"code": "CON-PRO-04-LATAM",
					"category": "Delivery",
					"role": "Executive Producer",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Production \/ Coordination",
						"code": "PRO",
						"combined": "Content | Production \/ Coordination",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 5,
						"name": "Lead",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "90.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2071,
					"code": "CON-PRO-04-APAC",
					"category": "Delivery",
					"role": "Executive Producer",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Production \/ Coordination",
						"code": "PRO",
						"combined": "Content | Production \/ Coordination",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 5,
						"name": "Lead",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "141.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2072,
					"code": "CON-PRO-04-US",
					"category": "Delivery",
					"role": "Senior Producer \/ Project Manager",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Production \/ Coordination",
						"code": "PRO",
						"combined": "Content | Production \/ Coordination",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "157.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2073,
					"code": "CON-PRO-04-EMEA",
					"category": "Delivery",
					"role": "Senior Producer \/ Project Manager",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Production \/ Coordination",
						"code": "PRO",
						"combined": "Content | Production \/ Coordination",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "153.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2074,
					"code": "CON-PRO-04-LATAM",
					"category": "Delivery",
					"role": "Senior Producer \/ Project Manager",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Production \/ Coordination",
						"code": "PRO",
						"combined": "Content | Production \/ Coordination",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "80.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2075,
					"code": "CON-PRO-04-APAC",
					"category": "Delivery",
					"role": "Senior Producer \/ Project Manager",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Production \/ Coordination",
						"code": "PRO",
						"combined": "Content | Production \/ Coordination",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "104.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2076,
					"code": "CON-PRO-03-US",
					"category": "Delivery",
					"role": "Producer \/ Project Manager",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Production \/ Coordination",
						"code": "PRO",
						"combined": "Content | Production \/ Coordination",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "135.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2077,
					"code": "CON-PRO-03-EMEA",
					"category": "Delivery",
					"role": "Producer \/ Project Manager",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Production \/ Coordination",
						"code": "PRO",
						"combined": "Content | Production \/ Coordination",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "135.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2078,
					"code": "CON-PRO-03-LATAM",
					"category": "Delivery",
					"role": "Producer \/ Project Manager",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Production \/ Coordination",
						"code": "PRO",
						"combined": "Content | Production \/ Coordination",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "77.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2079,
					"code": "CON-PRO-03-APAC",
					"category": "Delivery",
					"role": "Producer \/ Project Manager",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Production \/ Coordination",
						"code": "PRO",
						"combined": "Content | Production \/ Coordination",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "85.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2080,
					"code": "CON-PRM-04-US",
					"category": "Delivery",
					"role": "Senior Technical Project Manager",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Project Management",
						"code": "PRM",
						"combined": "Content | Project Management",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "135.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2081,
					"code": "CON-PRM-04-EMEA",
					"category": "Delivery",
					"role": "Senior Technical Project Manager",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Project Management",
						"code": "PRM",
						"combined": "Content | Project Management",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "135.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2082,
					"code": "CON-PRM-04-LATAM",
					"category": "Delivery",
					"role": "Senior Technical Project Manager",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Project Management",
						"code": "PRM",
						"combined": "Content | Project Management",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "75.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2083,
					"code": "CON-PRM-04-APAC",
					"category": "Delivery",
					"role": "Senior Technical Project Manager",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Project Management",
						"code": "PRM",
						"combined": "Content | Project Management",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "130.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2084,
					"code": "CON-PRM-03-US",
					"category": "Delivery",
					"role": "Technical Project Manager",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Project Management",
						"code": "PRM",
						"combined": "Content | Project Management",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "120.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2085,
					"code": "CON-PRM-03-EMEA",
					"category": "Delivery",
					"role": "Technical Project Manager",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Project Management",
						"code": "PRM",
						"combined": "Content | Project Management",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "120.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2086,
					"code": "CON-PRM-03-LATAM",
					"category": "Delivery",
					"role": "Technical Project Manager",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Project Management",
						"code": "PRM",
						"combined": "Content | Project Management",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "70.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:41+00:00",
					"updated": "2025-08-04T13:19:41+00:00",
					"deleted": null
				},
				{
					"id": 2087,
					"code": "CON-PRM-03-APAC",
					"category": "Delivery",
					"role": "Technical Project Manager",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Project Management",
						"code": "PRM",
						"combined": "Content | Project Management",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "107.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2088,
					"code": "CON-PRM-03-APAC",
					"category": "Delivery",
					"role": "AdOps Manager",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Project Management",
						"code": "PRM",
						"combined": "Content | Project Management",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "45.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2089,
					"code": "CON-PRM-04-US",
					"category": "Delivery",
					"role": "Senior Project Manager",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Project Management",
						"code": "PRM",
						"combined": "Content | Project Management",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "125.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2090,
					"code": "CON-PRM-04-EMEA",
					"category": "Delivery",
					"role": "Senior Project Manager",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Project Management",
						"code": "PRM",
						"combined": "Content | Project Management",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "120.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2091,
					"code": "CON-PRM-04-LATAM",
					"category": "Delivery",
					"role": "Senior Project Manager",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Project Management",
						"code": "PRM",
						"combined": "Content | Project Management",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "84.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2092,
					"code": "CON-PRM-04-APAC",
					"category": "Delivery",
					"role": "Senior Project Manager",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Project Management",
						"code": "PRM",
						"combined": "Content | Project Management",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "55.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2093,
					"code": "DEV-BAN-03-US",
					"category": "Delivery",
					"role": "Business Analyst",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Business Analytics",
						"code": "BAN",
						"combined": "Development | Business Analytics",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "100.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2094,
					"code": "DEV-BAN-03-EMEA",
					"category": "Delivery",
					"role": "Business Analyst",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Business Analytics",
						"code": "BAN",
						"combined": "Development | Business Analytics",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "100.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2095,
					"code": "DEV-BAN-03-LATAM",
					"category": "Delivery",
					"role": "Business Analyst",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Business Analytics",
						"code": "BAN",
						"combined": "Development | Business Analytics",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "70.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2096,
					"code": "DEV-BAN-03-APAC",
					"category": "Delivery",
					"role": "Business Analyst",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Business Analytics",
						"code": "BAN",
						"combined": "Development | Business Analytics",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "104.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2097,
					"code": "CON-PRO-02-US",
					"category": "Delivery",
					"role": "Associate Producer \/ Project Manager",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Production \/ Coordination",
						"code": "PRO",
						"combined": "Content | Production \/ Coordination",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 2,
						"name": "Junior",
						"code": 2
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "95.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2098,
					"code": "CON-PRO-02-EMEA",
					"category": "Delivery",
					"role": "Associate Producer \/ Project Manager",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Production \/ Coordination",
						"code": "PRO",
						"combined": "Content | Production \/ Coordination",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 2,
						"name": "Junior",
						"code": 2
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "95.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2099,
					"code": "CON-PRO-02-LATAM",
					"category": "Delivery",
					"role": "Associate Producer \/ Project Manager",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Production \/ Coordination",
						"code": "PRO",
						"combined": "Content | Production \/ Coordination",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 2,
						"name": "Junior",
						"code": 2
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "65.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2100,
					"code": "CON-PRO-02-APAC",
					"category": "Delivery",
					"role": "Associate Producer \/ Project Manager",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Production \/ Coordination",
						"code": "PRO",
						"combined": "Content | Production \/ Coordination",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 2,
						"name": "Junior",
						"code": 2
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "59.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2101,
					"code": "CRE-CON-09-US",
					"category": "Creative",
					"role": "Executive Creative Director",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Concept",
						"code": "CON",
						"combined": "Creative | Concept",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 10,
						"name": "SVP",
						"code": 9
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "500.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2102,
					"code": "CRE-CON-09-EMEA",
					"category": "Creative",
					"role": "Executive Creative Director",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Concept",
						"code": "CON",
						"combined": "Creative | Concept",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 10,
						"name": "SVP",
						"code": 9
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "230.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2103,
					"code": "CRE-CON-09-LATAM",
					"category": "Creative",
					"role": "Executive Creative Director",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Concept",
						"code": "CON",
						"combined": "Creative | Concept",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 10,
						"name": "SVP",
						"code": 9
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "94.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2104,
					"code": "CRE-CON-07-US",
					"category": "Creative",
					"role": "Group Creative Director",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Concept",
						"code": "CON",
						"combined": "Creative | Concept",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 8,
						"name": "Senior Director",
						"code": 7
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "375.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2105,
					"code": "CRE-CON-07-EMEA",
					"category": "Creative",
					"role": "Group Creative Director",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Concept",
						"code": "CON",
						"combined": "Creative | Concept",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 8,
						"name": "Senior Director",
						"code": 7
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "215.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2106,
					"code": "CRE-CON-07-LATAM",
					"category": "Creative",
					"role": "Group Creative Director",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Concept",
						"code": "CON",
						"combined": "Creative | Concept",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 8,
						"name": "Senior Director",
						"code": 7
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "91.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2107,
					"code": "CRE-CON-06-US",
					"category": "Creative",
					"role": "Creative Director",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Concept",
						"code": "CON",
						"combined": "Creative | Concept",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 7,
						"name": "Director",
						"code": 6
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "325.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2108,
					"code": "CRE-CON-06-EMEA",
					"category": "Creative",
					"role": "Creative Director",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Concept",
						"code": "CON",
						"combined": "Creative | Concept",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 7,
						"name": "Director",
						"code": 6
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "180.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2109,
					"code": "CRE-CON-06-LATAM",
					"category": "Creative",
					"role": "Creative Director",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Concept",
						"code": "CON",
						"combined": "Creative | Concept",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 7,
						"name": "Director",
						"code": 6
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "90.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2110,
					"code": "CRE-CON-05-US",
					"category": "Creative",
					"role": "Associate Creative Director",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Concept",
						"code": "CON",
						"combined": "Creative | Concept",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 6,
						"name": "Associate Director",
						"code": 5
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "250.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2111,
					"code": "CRE-CON-05-EMEA",
					"category": "Creative",
					"role": "Associate Creative Director",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Concept",
						"code": "CON",
						"combined": "Creative | Concept",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 6,
						"name": "Associate Director",
						"code": 5
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "145.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2112,
					"code": "CRE-CON-05-LATAM",
					"category": "Creative",
					"role": "Associate Creative Director",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Concept",
						"code": "CON",
						"combined": "Creative | Concept",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 6,
						"name": "Associate Director",
						"code": 5
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "75.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2113,
					"code": "CRE-CON-07-US",
					"category": "Creative",
					"role": "Senior Art Director",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Concept",
						"code": "CON",
						"combined": "Creative | Concept",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 8,
						"name": "Senior Director",
						"code": 7
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "165.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2114,
					"code": "CRE-CON-07-EMEA",
					"category": "Creative",
					"role": "Senior Art Director",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Concept",
						"code": "CON",
						"combined": "Creative | Concept",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 8,
						"name": "Senior Director",
						"code": 7
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "165.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2115,
					"code": "CRE-CON-07-LATAM",
					"category": "Creative",
					"role": "Senior Art Director",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Concept",
						"code": "CON",
						"combined": "Creative | Concept",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 8,
						"name": "Senior Director",
						"code": 7
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "92.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2116,
					"code": "CRE-CON-07-APAC",
					"category": "Creative",
					"role": "Senior Art Director",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Concept",
						"code": "CON",
						"combined": "Creative | Concept",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 8,
						"name": "Senior Director",
						"code": 7
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "126.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2117,
					"code": "CRE-CON-06-US",
					"category": "Creative",
					"role": "Art Director",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Concept",
						"code": "CON",
						"combined": "Creative | Concept",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 7,
						"name": "Director",
						"code": 6
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "152.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2118,
					"code": "CRE-CON-06-EMEA",
					"category": "Creative",
					"role": "Art Director",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Concept",
						"code": "CON",
						"combined": "Creative | Concept",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 7,
						"name": "Director",
						"code": 6
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "152.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2119,
					"code": "CRE-CON-06-LATAM",
					"category": "Creative",
					"role": "Art Director",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Concept",
						"code": "CON",
						"combined": "Creative | Concept",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 7,
						"name": "Director",
						"code": 6
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "90.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2120,
					"code": "CRE-CON-06-APAC",
					"category": "Creative",
					"role": "Art Director",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Concept",
						"code": "CON",
						"combined": "Creative | Concept",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 7,
						"name": "Director",
						"code": 6
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "115.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2121,
					"code": "CRE-CON-04-US",
					"category": "Creative",
					"role": "Senior Designer",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Concept",
						"code": "CON",
						"combined": "Creative | Concept",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "175.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2122,
					"code": "CRE-CON-04-EMEA",
					"category": "Creative",
					"role": "Senior Designer",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Concept",
						"code": "CON",
						"combined": "Creative | Concept",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "110.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2123,
					"code": "CRE-CON-04-LATAM",
					"category": "Creative",
					"role": "Senior Designer",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Concept",
						"code": "CON",
						"combined": "Creative | Concept",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "71.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2124,
					"code": "CRE-DES-03-US",
					"category": "Creative",
					"role": "Designer",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Design",
						"code": "DES",
						"combined": "Creative | Design",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "160.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2125,
					"code": "CRE-DES-03-EMEA",
					"category": "Creative",
					"role": "Designer",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Design",
						"code": "DES",
						"combined": "Creative | Design",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "91.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2126,
					"code": "CRE-DES-03-LATAM",
					"category": "Creative",
					"role": "Designer",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Design",
						"code": "DES",
						"combined": "Creative | Design",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "69.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2127,
					"code": "CRE-COP-04-US",
					"category": "Creative",
					"role": "Senior Copywriter",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Copy",
						"code": "COP",
						"combined": "Creative | Copy",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "175.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2128,
					"code": "CRE-COP-04-EMEA",
					"category": "Creative",
					"role": "Senior Copywriter",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Copy",
						"code": "COP",
						"combined": "Creative | Copy",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "110.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2129,
					"code": "CRE-COP-04-LATAM",
					"category": "Creative",
					"role": "Senior Copywriter",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Copy",
						"code": "COP",
						"combined": "Creative | Copy",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "71.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2130,
					"code": "CRE-COP-03-US",
					"category": "Creative",
					"role": "Copywriter",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Copy",
						"code": "COP",
						"combined": "Creative | Copy",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "160.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2131,
					"code": "CRE-COP-03-EMEA",
					"category": "Creative",
					"role": "Copywriter",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Copy",
						"code": "COP",
						"combined": "Creative | Copy",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "91.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2132,
					"code": "CRE-COP-03-LATAM",
					"category": "Creative",
					"role": "Copywriter",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Copy",
						"code": "COP",
						"combined": "Creative | Copy",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "69.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2133,
					"code": "CRE-ART-04-US",
					"category": "Creative",
					"role": "Senior Illustrator",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Art & Illustration",
						"code": "ART",
						"combined": "Creative | Art & Illustration",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "110.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2134,
					"code": "CRE-ART-04-EMEA",
					"category": "Creative",
					"role": "Senior Illustrator",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Art & Illustration",
						"code": "ART",
						"combined": "Creative | Art & Illustration",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "110.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2135,
					"code": "CRE-ART-04-LATAM",
					"category": "Creative",
					"role": "Senior Illustrator",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Art & Illustration",
						"code": "ART",
						"combined": "Creative | Art & Illustration",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "85.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2136,
					"code": "CRE-ART-04-APAC",
					"category": "Creative",
					"role": "Senior Illustrator",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Art & Illustration",
						"code": "ART",
						"combined": "Creative | Art & Illustration",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "104.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2137,
					"code": "CRE-ART-03-US",
					"category": "Creative",
					"role": "Illustrator",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Art & Illustration",
						"code": "ART",
						"combined": "Creative | Art & Illustration",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "100.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2138,
					"code": "CRE-ART-03-EMEA",
					"category": "Creative",
					"role": "Illustrator",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Art & Illustration",
						"code": "ART",
						"combined": "Creative | Art & Illustration",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "100.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2139,
					"code": "CRE-ART-03-LATAM",
					"category": "Creative",
					"role": "Illustrator",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Art & Illustration",
						"code": "ART",
						"combined": "Creative | Art & Illustration",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "70.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2140,
					"code": "CRE-ART-03-APAC",
					"category": "Creative",
					"role": "Illustrator",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Art & Illustration",
						"code": "ART",
						"combined": "Creative | Art & Illustration",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "100.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2141,
					"code": "CRE-MOT-04-US",
					"category": "Animation",
					"role": "Motion Designer Lead",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Motion & Animation",
						"code": "MOT",
						"combined": "Creative | Motion & Animation",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 5,
						"name": "Lead",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "250.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2142,
					"code": "CRE-MOT-04-US",
					"category": "Animation",
					"role": "Senior Motion Designer",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Motion & Animation",
						"code": "MOT",
						"combined": "Creative | Motion & Animation",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "225.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2143,
					"code": "CRE-MOT-04-EMEA",
					"category": "Animation",
					"role": "Senior Motion Designer",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Motion & Animation",
						"code": "MOT",
						"combined": "Creative | Motion & Animation",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "137.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2144,
					"code": "CRE-MOT-04-LATAM",
					"category": "Animation",
					"role": "Senior Motion Designer",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Motion & Animation",
						"code": "MOT",
						"combined": "Creative | Motion & Animation",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "92.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2145,
					"code": "CRE-MOT-04-APAC",
					"category": "Animation",
					"role": "Senior Motion Designer",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Motion & Animation",
						"code": "MOT",
						"combined": "Creative | Motion & Animation",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "104.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2146,
					"code": "CRE-MOT-03-US",
					"category": "Animation",
					"role": "Motion Designer",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Motion & Animation",
						"code": "MOT",
						"combined": "Creative | Motion & Animation",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "130.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2147,
					"code": "CRE-MOT-03-EMEA",
					"category": "Animation",
					"role": "Motion Designer",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Motion & Animation",
						"code": "MOT",
						"combined": "Creative | Motion & Animation",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "130.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2148,
					"code": "CRE-MOT-03-LATAM",
					"category": "Animation",
					"role": "Motion Designer",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Motion & Animation",
						"code": "MOT",
						"combined": "Creative | Motion & Animation",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "90.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2149,
					"code": "CRE-MOT-03-APAC",
					"category": "Animation",
					"role": "Motion Designer",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Motion & Animation",
						"code": "MOT",
						"combined": "Creative | Motion & Animation",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "100.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2150,
					"code": "DEV-TED-06-US",
					"category": "Development",
					"role": "Technical Director",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Technical Direction",
						"code": "TED",
						"combined": "Development | Technical Direction",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 7,
						"name": "Director",
						"code": 6
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "160.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2151,
					"code": "DEV-TED-06-EMEA",
					"category": "Development",
					"role": "Technical Director",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Technical Direction",
						"code": "TED",
						"combined": "Development | Technical Direction",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 7,
						"name": "Director",
						"code": 6
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "160.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2152,
					"code": "DEV-TED-06-LATAM",
					"category": "Development",
					"role": "Technical Director",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Technical Direction",
						"code": "TED",
						"combined": "Development | Technical Direction",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 7,
						"name": "Director",
						"code": 6
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "100.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2153,
					"code": "DEV-TED-06-APAC",
					"category": "Development",
					"role": "Technical Director",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Technical Direction",
						"code": "TED",
						"combined": "Development | Technical Direction",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 7,
						"name": "Director",
						"code": 6
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "141.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2154,
					"code": "DEV-FRO-04-US",
					"category": "Development",
					"role": "Lead Developer - Front End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Front-end",
						"code": "FRO",
						"combined": "Development | Front-end",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 5,
						"name": "Lead",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "155.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2155,
					"code": "DEV-FRO-04-EMEA",
					"category": "Development",
					"role": "Lead Developer - Front End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Front-end",
						"code": "FRO",
						"combined": "Development | Front-end",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 5,
						"name": "Lead",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "155.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2156,
					"code": "DEV-FRO-04-LATAM",
					"category": "Development",
					"role": "Lead Developer - Front End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Front-end",
						"code": "FRO",
						"combined": "Development | Front-end",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 5,
						"name": "Lead",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "90.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2157,
					"code": "DEV-FRO-04-APAC",
					"category": "Development",
					"role": "Lead Developer - Front End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Front-end",
						"code": "FRO",
						"combined": "Development | Front-end",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 5,
						"name": "Lead",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "122.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2158,
					"code": "DEV-FRO-04-US",
					"category": "Development",
					"role": "Senior Developer - Front End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Front-end",
						"code": "FRO",
						"combined": "Development | Front-end",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "145.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2159,
					"code": "DEV-FRO-04-EMEA",
					"category": "Development",
					"role": "Senior Developer - Front End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Front-end",
						"code": "FRO",
						"combined": "Development | Front-end",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "145.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2160,
					"code": "DEV-FRO-04-LATAM",
					"category": "Development",
					"role": "Senior Developer - Front End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Front-end",
						"code": "FRO",
						"combined": "Development | Front-end",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "85.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2161,
					"code": "DEV-FRO-04-APAC",
					"category": "Development",
					"role": "Senior Developer - Front End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Front-end",
						"code": "FRO",
						"combined": "Development | Front-end",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "111.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2162,
					"code": "DEV-FRO-03-US",
					"category": "Development",
					"role": "Developer - Front End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Front-end",
						"code": "FRO",
						"combined": "Development | Front-end",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "120.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2163,
					"code": "DEV-FRO-03-EMEA",
					"category": "Development",
					"role": "Developer - Front End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Front-end",
						"code": "FRO",
						"combined": "Development | Front-end",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "120.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2164,
					"code": "DEV-FRO-03-LATAM",
					"category": "Development",
					"role": "Developer - Front End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Front-end",
						"code": "FRO",
						"combined": "Development | Front-end",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "75.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2165,
					"code": "DEV-FRO-03-APAC",
					"category": "Development",
					"role": "Developer - Front End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Front-end",
						"code": "FRO",
						"combined": "Development | Front-end",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "85.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2166,
					"code": "DEV-FRO-03-US",
					"category": "Development",
					"role": "Development Manager - Front End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Front-end",
						"code": "FRO",
						"combined": "Development | Front-end",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "130.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2167,
					"code": "DEV-FRO-03-EMEA",
					"category": "Development",
					"role": "Development Manager - Front End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Front-end",
						"code": "FRO",
						"combined": "Development | Front-end",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "130.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2168,
					"code": "DEV-FRO-03-LATAM",
					"category": "Development",
					"role": "Development Manager - Front End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Front-end",
						"code": "FRO",
						"combined": "Development | Front-end",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "75.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2169,
					"code": "DEV-FRO-03-APAC",
					"category": "Development",
					"role": "Development Manager - Front End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Front-end",
						"code": "FRO",
						"combined": "Development | Front-end",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "130.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2170,
					"code": "DEV-BAC-04-US",
					"category": "Development",
					"role": "Lead Developer - Back End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Back-end",
						"code": "BAC",
						"combined": "Development | Back-end",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 5,
						"name": "Lead",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "155.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2171,
					"code": "DEV-BAC-04-EMEA",
					"category": "Development",
					"role": "Lead Developer - Back End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Back-end",
						"code": "BAC",
						"combined": "Development | Back-end",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 5,
						"name": "Lead",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "155.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2172,
					"code": "DEV-BAC-04-LATAM",
					"category": "Development",
					"role": "Lead Developer - Back End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Back-end",
						"code": "BAC",
						"combined": "Development | Back-end",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 5,
						"name": "Lead",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "90.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2173,
					"code": "DEV-BAC-04-APAC",
					"category": "Development",
					"role": "Lead Developer - Back End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Back-end",
						"code": "BAC",
						"combined": "Development | Back-end",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 5,
						"name": "Lead",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "122.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2174,
					"code": "DEV-BAC-04-US",
					"category": "Development",
					"role": "Senior Developer - Back End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Back-end",
						"code": "BAC",
						"combined": "Development | Back-end",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "145.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2175,
					"code": "DEV-BAC-04-EMEA",
					"category": "Development",
					"role": "Senior Developer - Back End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Back-end",
						"code": "BAC",
						"combined": "Development | Back-end",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "145.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2176,
					"code": "DEV-BAC-04-LATAM",
					"category": "Development",
					"role": "Senior Developer - Back End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Back-end",
						"code": "BAC",
						"combined": "Development | Back-end",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "85.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2177,
					"code": "DEV-BAC-04-APAC",
					"category": "Development",
					"role": "Senior Developer - Back End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Back-end",
						"code": "BAC",
						"combined": "Development | Back-end",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "111.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2178,
					"code": "DEV-BAC-03-US",
					"category": "Development",
					"role": "Developer - Back End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Back-end",
						"code": "BAC",
						"combined": "Development | Back-end",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "120.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2179,
					"code": "DEV-BAC-03-EMEA",
					"category": "Development",
					"role": "Developer - Back End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Back-end",
						"code": "BAC",
						"combined": "Development | Back-end",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "120.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2180,
					"code": "DEV-BAC-03-LATAM",
					"category": "Development",
					"role": "Developer - Back End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Back-end",
						"code": "BAC",
						"combined": "Development | Back-end",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "75.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2181,
					"code": "DEV-BAC-03-APAC",
					"category": "Development",
					"role": "Developer - Back End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Back-end",
						"code": "BAC",
						"combined": "Development | Back-end",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "78.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2182,
					"code": "DEV-BAC-03-US",
					"category": "Development",
					"role": "Development Manager - Back End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Back-end",
						"code": "BAC",
						"combined": "Development | Back-end",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "130.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2183,
					"code": "DEV-BAC-03-EMEA",
					"category": "Development",
					"role": "Development Manager - Back End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Back-end",
						"code": "BAC",
						"combined": "Development | Back-end",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "130.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2184,
					"code": "DEV-BAC-03-LATAM",
					"category": "Development",
					"role": "Development Manager - Back End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Back-end",
						"code": "BAC",
						"combined": "Development | Back-end",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "75.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2185,
					"code": "DEV-BAC-03-APAC",
					"category": "Development",
					"role": "Development Manager - Back End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Back-end",
						"code": "BAC",
						"combined": "Development | Back-end",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "118.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2186,
					"code": "DEV-CRT-04-US",
					"category": "Development",
					"role": "Lead Developer - DM",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Creative Technology",
						"code": "CRT",
						"combined": "Development | Creative Technology",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 5,
						"name": "Lead",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "110.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2187,
					"code": "DEV-CRT-04-EMEA",
					"category": "Development",
					"role": "Lead Developer - DM",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Creative Technology",
						"code": "CRT",
						"combined": "Development | Creative Technology",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 5,
						"name": "Lead",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "110.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2188,
					"code": "DEV-CRT-04-LATAM",
					"category": "Development",
					"role": "Lead Developer - DM",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Creative Technology",
						"code": "CRT",
						"combined": "Development | Creative Technology",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 5,
						"name": "Lead",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "85.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2189,
					"code": "DEV-CRT-04-APAC",
					"category": "Development",
					"role": "Lead Developer - DM",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Creative Technology",
						"code": "CRT",
						"combined": "Development | Creative Technology",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 5,
						"name": "Lead",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "122.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2190,
					"code": "DEV-FUN-04-US",
					"category": "QA",
					"role": "Senior Developer - DM",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Functional QA",
						"code": "FUN",
						"combined": "Development | Functional QA",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "105.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2191,
					"code": "DEV-FUN-04-EMEA",
					"category": "QA",
					"role": "Senior Developer - DM",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Functional QA",
						"code": "FUN",
						"combined": "Development | Functional QA",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "105.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2192,
					"code": "DEV-FUN-04-LATAM",
					"category": "QA",
					"role": "Senior Developer - DM",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Functional QA",
						"code": "FUN",
						"combined": "Development | Functional QA",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "85.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2193,
					"code": "DEV-FUN-04-APAC",
					"category": "QA",
					"role": "Senior Developer - DM",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Functional QA",
						"code": "FUN",
						"combined": "Development | Functional QA",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "101.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2194,
					"code": "DEV-FUN-03-US",
					"category": "QA",
					"role": "Developer - DM",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Functional QA",
						"code": "FUN",
						"combined": "Development | Functional QA",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "100.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2195,
					"code": "DEV-FUN-03-EMEA",
					"category": "QA",
					"role": "Developer - DM",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Functional QA",
						"code": "FUN",
						"combined": "Development | Functional QA",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "100.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2196,
					"code": "DEV-FUN-03-LATAM",
					"category": "QA",
					"role": "Developer - DM",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Functional QA",
						"code": "FUN",
						"combined": "Development | Functional QA",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "80.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2197,
					"code": "DEV-FUN-03-APAC",
					"category": "QA",
					"role": "Developer - DM",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Functional QA",
						"code": "FUN",
						"combined": "Development | Functional QA",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "85.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2198,
					"code": "DEV-FUN-03-US",
					"category": "QA",
					"role": "Tester - QA",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Functional QA",
						"code": "FUN",
						"combined": "Development | Functional QA",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "100.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2199,
					"code": "DEV-FUN-03-EMEA",
					"category": "QA",
					"role": "Tester - QA",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Functional QA",
						"code": "FUN",
						"combined": "Development | Functional QA",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "100.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2200,
					"code": "DEV-FUN-03-LATAM",
					"category": "QA",
					"role": "Tester - QA",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Functional QA",
						"code": "FUN",
						"combined": "Development | Functional QA",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "75.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2201,
					"code": "DEV-FUN-03-APAC",
					"category": "QA",
					"role": "Tester - QA",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Functional QA",
						"code": "FUN",
						"combined": "Development | Functional QA",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "74.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2202,
					"code": "DEV-FUN-04-US",
					"category": "QA",
					"role": "Lead Tester - QA",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Functional QA",
						"code": "FUN",
						"combined": "Development | Functional QA",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 5,
						"name": "Lead",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "123.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2203,
					"code": "DEV-FUN-04-EMEA",
					"category": "QA",
					"role": "Lead Tester - QA",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Functional QA",
						"code": "FUN",
						"combined": "Development | Functional QA",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 5,
						"name": "Lead",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "118.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2204,
					"code": "DEV-FUN-04-LATAM",
					"category": "QA",
					"role": "Lead Tester - QA",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Functional QA",
						"code": "FUN",
						"combined": "Development | Functional QA",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 5,
						"name": "Lead",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "77.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2205,
					"code": "DEV-FUN-04-APAC",
					"category": "QA",
					"role": "Lead Tester - QA",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Functional QA",
						"code": "FUN",
						"combined": "Development | Functional QA",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 5,
						"name": "Lead",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "79.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2206,
					"code": "DEV-FUN-03-US",
					"category": "QA",
					"role": "QE - Back End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Functional QA",
						"code": "FUN",
						"combined": "Development | Functional QA",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "100.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2207,
					"code": "DEV-FUN-03-EMEA",
					"category": "QA",
					"role": "QE - Back End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Functional QA",
						"code": "FUN",
						"combined": "Development | Functional QA",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "100.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2208,
					"code": "DEV-FUN-03-LATAM",
					"category": "QA",
					"role": "QE - Back End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Functional QA",
						"code": "FUN",
						"combined": "Development | Functional QA",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "75.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2209,
					"code": "DEV-FUN-03-APAC",
					"category": "QA",
					"role": "QE - Back End",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Functional QA",
						"code": "FUN",
						"combined": "Development | Functional QA",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "88.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2210,
					"code": "DEV-FUN-04-US",
					"category": "QA",
					"role": "Lead Tester - QE",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Functional QA",
						"code": "FUN",
						"combined": "Development | Functional QA",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 5,
						"name": "Lead",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "110.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2211,
					"code": "DEV-FUN-04-EMEA",
					"category": "QA",
					"role": "Lead Tester - QE",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Functional QA",
						"code": "FUN",
						"combined": "Development | Functional QA",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 5,
						"name": "Lead",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "110.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2212,
					"code": "DEV-FUN-04-LATAM",
					"category": "QA",
					"role": "Lead Tester - QE",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Functional QA",
						"code": "FUN",
						"combined": "Development | Functional QA",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 5,
						"name": "Lead",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "77.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2213,
					"code": "DEV-FUN-04-APAC",
					"category": "QA",
					"role": "Lead Tester - QE",
					"jobFamily": {
						"group": "Development",
						"groupCode": "DEV",
						"name": "Functional QA",
						"code": "FUN",
						"combined": "Development | Functional QA",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 5,
						"name": "Lead",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "111.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2214,
					"code": "CRE-EDI-02-US",
					"category": "Post Production",
					"role": "Junior Colorist",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Editing",
						"code": "EDI",
						"combined": "Creative | Editing",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 2,
						"name": "Junior",
						"code": 2
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "180.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2215,
					"code": "CRE-EDI-03-US",
					"category": "Post Production",
					"role": "Colorist",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Editing",
						"code": "EDI",
						"combined": "Creative | Editing",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "300.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2216,
					"code": "CRE-EDI-04-US",
					"category": "Post Production",
					"role": "Senior Colorist",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Editing",
						"code": "EDI",
						"combined": "Creative | Editing",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "300.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2217,
					"code": "CRE-SOS-04-US",
					"category": "Post Production",
					"role": "Senior Sound Designer",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Sound",
						"code": "SOS",
						"combined": "Creative | Sound",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "150.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2218,
					"code": "CRE-SOS-04-EMEA",
					"category": "Post Production",
					"role": "Senior Sound Designer",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Sound",
						"code": "SOS",
						"combined": "Creative | Sound",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "110.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2219,
					"code": "CRE-SOS-04-LATAM",
					"category": "Post Production",
					"role": "Senior Sound Designer",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Sound",
						"code": "SOS",
						"combined": "Creative | Sound",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "45.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2220,
					"code": "CRE-EDI-03-EMEA",
					"category": "Post Production",
					"role": "Video Editor \/ AV",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Editing",
						"code": "EDI",
						"combined": "Creative | Editing",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "121.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2221,
					"code": "CRE-EDI-03-APAC",
					"category": "Post Production",
					"role": "Video Editor \/ AV",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Editing",
						"code": "EDI",
						"combined": "Creative | Editing",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "42.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2222,
					"code": "CRE-EDI-03-US",
					"category": "Post Production",
					"role": "Online Editor",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Editing",
						"code": "EDI",
						"combined": "Creative | Editing",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "275.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2223,
					"code": "CRE-EDI-03-EMEA",
					"category": "Post Production",
					"role": "Online Editor",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Editing",
						"code": "EDI",
						"combined": "Creative | Editing",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "89.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2224,
					"code": "CRE-EDI-03-LATAM",
					"category": "Post Production",
					"role": "Online Editor",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Editing",
						"code": "EDI",
						"combined": "Creative | Editing",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "89.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2225,
					"code": "CRE-EDI-03-APAC",
					"category": "Post Production",
					"role": "Online Editor",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Editing",
						"code": "EDI",
						"combined": "Creative | Editing",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "91.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2226,
					"code": "CRE-EDI-03-US",
					"category": "Post Production",
					"role": "Offline Editor",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Editing",
						"code": "EDI",
						"combined": "Creative | Editing",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "250.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2227,
					"code": "CRE-EDI-03-EMEA",
					"category": "Post Production",
					"role": "Offline Editor",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Editing",
						"code": "EDI",
						"combined": "Creative | Editing",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "122.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2228,
					"code": "CRE-EDI-03-LATAM",
					"category": "Post Production",
					"role": "Offline Editor",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Editing",
						"code": "EDI",
						"combined": "Creative | Editing",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "100.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2229,
					"code": "CRE-EDI-03-APAC",
					"category": "Post Production",
					"role": "Offline Editor",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Editing",
						"code": "EDI",
						"combined": "Creative | Editing",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "61.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2230,
					"code": "CRE-EDI-03-US",
					"category": "Post Production",
					"role": "VFX Compositor",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Editing",
						"code": "EDI",
						"combined": "Creative | Editing",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "350.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2231,
					"code": "CRE-EDI-03-EMEA",
					"category": "Post Production",
					"role": "VFX Compositor",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Editing",
						"code": "EDI",
						"combined": "Creative | Editing",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "214.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2232,
					"code": "CRE-EDI-03-LATAM",
					"category": "Post Production",
					"role": "VFX Compositor",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Editing",
						"code": "EDI",
						"combined": "Creative | Editing",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "98.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2233,
					"code": "CRE-EDI-04-US",
					"category": "Post Production",
					"role": "Senior Photo Retoucher",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Editing",
						"code": "EDI",
						"combined": "Creative | Editing",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "130.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2234,
					"code": "CRE-EDI-04-EMEA",
					"category": "Post Production",
					"role": "Senior Photo Retoucher",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Editing",
						"code": "EDI",
						"combined": "Creative | Editing",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "130.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2235,
					"code": "CRE-EDI-04-LATAM",
					"category": "Post Production",
					"role": "Senior Photo Retoucher",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Editing",
						"code": "EDI",
						"combined": "Creative | Editing",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 4,
						"name": "Senior",
						"code": 4
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "80.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2236,
					"code": "CRE-EDI-03-US",
					"category": "Post Production",
					"role": "Photo Retoucher",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Editing",
						"code": "EDI",
						"combined": "Creative | Editing",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "125.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2237,
					"code": "CRE-EDI-03-EMEA",
					"category": "Post Production",
					"role": "Photo Retoucher",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Editing",
						"code": "EDI",
						"combined": "Creative | Editing",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "125.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2238,
					"code": "CRE-EDI-03-LATAM",
					"category": "Post Production",
					"role": "Photo Retoucher",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Editing",
						"code": "EDI",
						"combined": "Creative | Editing",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "80.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2239,
					"code": "CON-PRO-06-US",
					"category": "Content Production",
					"role": "Session Director",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Production \/ Coordination",
						"code": "PRO",
						"combined": "Content | Production \/ Coordination",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 7,
						"name": "Director",
						"code": 6
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "220.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2240,
					"code": "CON-PRO-03-US",
					"category": "Content Production",
					"role": "Proofreader",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Production \/ Coordination",
						"code": "PRO",
						"combined": "Content | Production \/ Coordination",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "60.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2241,
					"code": "CON-PRO-03-US",
					"category": "Content Production",
					"role": "Creative Technologist",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Production \/ Coordination",
						"code": "PRO",
						"combined": "Content | Production \/ Coordination",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "255.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2242,
					"code": "CON-PRO-03-EMEA",
					"category": "Content Production",
					"role": "Creative Technologist",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Production \/ Coordination",
						"code": "PRO",
						"combined": "Content | Production \/ Coordination",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "176.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2243,
					"code": "CON-PRO-03-LATAM",
					"category": "Content Production",
					"role": "Creative Technologist",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Production \/ Coordination",
						"code": "PRO",
						"combined": "Content | Production \/ Coordination",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "60.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2244,
					"code": "CON-PRO-03-US",
					"category": "Content Production",
					"role": "Pipeline Engineer",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Production \/ Coordination",
						"code": "PRO",
						"combined": "Content | Production \/ Coordination",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "240.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2245,
					"code": "CON-PRO-03-EMEA",
					"category": "Content Production",
					"role": "Pipeline Engineer",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Production \/ Coordination",
						"code": "PRO",
						"combined": "Content | Production \/ Coordination",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "182.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2246,
					"code": "CON-PRO-03-LATAM",
					"category": "Content Production",
					"role": "Pipeline Engineer",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Production \/ Coordination",
						"code": "PRO",
						"combined": "Content | Production \/ Coordination",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "75.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2247,
					"code": "CRE-VQA-03-US",
					"category": "Content Production",
					"role": "Quality Assurance",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Visual QA",
						"code": "VQA",
						"combined": "Creative | Visual QA",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "135.00"
						}
					],
					"location": "Us",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2248,
					"code": "CRE-VQA-03-EMEA",
					"category": "Content Production",
					"role": "Quality Assurance",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Visual QA",
						"code": "VQA",
						"combined": "Creative | Visual QA",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "59.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2249,
					"code": "CRE-VQA-03-LATAM",
					"category": "Content Production",
					"role": "Quality Assurance",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Visual QA",
						"code": "VQA",
						"combined": "Creative | Visual QA",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "55.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2250,
					"code": "CRE-VQA-03-APAC",
					"category": "Content Production",
					"role": "Quality Assurance",
					"jobFamily": {
						"group": "Creative",
						"groupCode": "CRE",
						"name": "Visual QA",
						"code": "VQA",
						"combined": "Creative | Visual QA",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "40.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2251,
					"code": "CON-PRO-03-EMEA",
					"category": "Content Production",
					"role": "Asset Editor",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Production \/ Coordination",
						"code": "PRO",
						"combined": "Content | Production \/ Coordination",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "60.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2252,
					"code": "CON-PRO-03-EMEA",
					"category": "Content Production",
					"role": "Ingest Engineer",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Production \/ Coordination",
						"code": "PRO",
						"combined": "Content | Production \/ Coordination",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "112.00"
						}
					],
					"location": "Emea",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2253,
					"code": "CON-PRO-03-LATAM",
					"category": "Content Production",
					"role": "Ingest Engineer",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Production \/ Coordination",
						"code": "PRO",
						"combined": "Content | Production \/ Coordination",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "72.00"
						}
					],
					"location": "Latam",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				},
				{
					"id": 2254,
					"code": "CON-PRO-03-APAC",
					"category": "Content Production",
					"role": "Ingest Engineer",
					"jobFamily": {
						"group": "Content",
						"groupCode": "CON",
						"name": "Production \/ Coordination",
						"code": "PRO",
						"combined": "Content | Production \/ Coordination",
						"created": "2025-06-16T11:12:58+00:00",
						"updated": "2025-06-16T11:12:58+00:00",
						"deleted": null
					},
					"level": {
						"id": 3,
						"name": "Mid",
						"code": 3
					},
					"marketRates": [
						{
							"market": "USA",
							"currency": "USD",
							"rate": "57.00"
						}
					],
					"location": "Apac",
					"created": "2025-08-04T13:19:42+00:00",
					"updated": "2025-08-04T13:19:42+00:00",
					"deleted": null
				}
			]
		},
		"deliverables": [
			{
				"deliverable": "Static Social Content",
				"number": 1,
				"client_name": "Buick",
				"asset_name": "Encore GX - Avenir trim",
				"asset_type": "Social Static – In Feed",
				"placement": "Meta",
				"duration": "Not relevant",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product-correct MY25 assets, utilize ST trim for Envista and Avenir trim for Encore GX, update creative copy elements, avoid lines around \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "1x1",
				"channel": "Facebook",
				"delivery_deadline": "2025-09-30",
				"target_audience": "Not specified"
			},
			{
				"deliverable": "Static Social Content",
				"number": 1,
				"client_name": "Buick",
				"asset_name": "Encore GX - Avenir trim",
				"asset_type": "Social Static – Story",
				"placement": "Meta",
				"duration": "Not relevant",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product-correct MY25 assets, utilize ST trim for Envista and Avenir trim for Encore GX, update creative copy elements, avoid lines around \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "9x16",
				"channel": "Instagram",
				"delivery_deadline": "2025-09-30",
				"target_audience": "Not specified"
			},
			{
				"deliverable": "Static Social Content",
				"number": 1,
				"client_name": "Buick",
				"asset_name": "Encore GX - Avenir trim",
				"asset_type": "Social Static – In Feed",
				"placement": "Meta",
				"duration": "Not relevant",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product-correct MY25 assets, utilize ST trim for Envista and Avenir trim for Encore GX, update creative copy elements, avoid lines around \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "1x1",
				"channel": "Facebook",
				"delivery_deadline": "2025-09-30",
				"target_audience": "Not specified"
			},
			{
				"deliverable": "Static Social Content",
				"number": 1,
				"client_name": "Buick",
				"asset_name": "Encore GX - Avenir trim",
				"asset_type": "Social Static – In Feed",
				"placement": "Meta",
				"duration": "Not relevant",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product-correct MY25 assets, utilize ST trim for Envista and Avenir trim for Encore GX, update creative copy elements, avoid lines around \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "1x1",
				"channel": "Facebook",
				"delivery_deadline": "2025-09-30",
				"target_audience": "Not specified"
			},
			{
				"deliverable": "Static Social Content",
				"number": 1,
				"client_name": "Buick",
				"asset_name": "Encore GX - Avenir trim",
				"asset_type": "Social Static – In Feed",
				"placement": "Meta",
				"duration": "Not relevant",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product-correct MY25 assets, utilize ST trim for Envista and Avenir trim for Encore GX, update creative copy elements, avoid lines around \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "1x1",
				"channel": "Facebook",
				"delivery_deadline": "2025-09-30",
				"target_audience": "Not specified"
			},
			{
				"deliverable": "Static Social Content",
				"number": 1,
				"client_name": "Buick",
				"asset_name": "Encore GX - Avenir trim",
				"asset_type": "Social Static – Story",
				"placement": "Meta",
				"duration": "Not relevant",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product-correct MY25 assets, utilize ST trim for Envista and Avenir trim for Encore GX, update creative copy elements, avoid lines around \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "9x16",
				"channel": "Instagram",
				"delivery_deadline": "2025-09-30",
				"target_audience": "Not specified"
			},
			{
				"deliverable": "Static Social Content",
				"number": 1,
				"client_name": "Buick",
				"asset_name": "Encore GX - Avenir trim",
				"asset_type": "Social Static – Story",
				"placement": "Meta",
				"duration": "Not relevant",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product-correct MY25 assets, utilize ST trim for Envista and Avenir trim for Encore GX, update creative copy elements, avoid lines around \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "9x16",
				"channel": "Instagram",
				"delivery_deadline": "2025-09-30",
				"target_audience": "Not specified"
			},
			{
				"deliverable": "Static Social Content",
				"number": 1,
				"client_name": "Buick",
				"asset_name": "Encore GX - Avenir trim",
				"asset_type": "Social Static – Story",
				"placement": "Meta",
				"duration": "Not relevant",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product-correct MY25 assets, utilize ST trim for Envista and Avenir trim for Encore GX, update creative copy elements, avoid lines around \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "9x16",
				"channel": "Instagram",
				"delivery_deadline": "2025-09-30",
				"target_audience": "Not specified"
			},
			{
				"deliverable": "Static Social Content",
				"number": 1,
				"client_name": "Buick",
				"asset_name": "Encore GX - Avenir trim",
				"asset_type": "Social Static – In Feed",
				"placement": "Pinterest",
				"duration": "Not relevant",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product-correct MY25 assets, utilize ST trim for Envista and Avenir trim for Encore GX, update creative copy elements, avoid lines around \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "2x3",
				"channel": "Pinterest",
				"delivery_deadline": "2025-09-30",
				"target_audience": "Not specified"
			},
			{
				"deliverable": "Static Social Content",
				"number": 1,
				"client_name": "Buick",
				"asset_name": "Encore GX - Avenir trim",
				"asset_type": "Social Static – In Feed",
				"placement": "Pinterest",
				"duration": "Not relevant",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product-correct MY25 assets, utilize ST trim for Envista and Avenir trim for Encore GX, update creative copy elements, avoid lines around \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "2x3",
				"channel": "Pinterest",
				"delivery_deadline": "2025-09-30",
				"target_audience": "Not specified"
			},
			{
				"deliverable": "Static Social Content",
				"number": 1,
				"client_name": "Buick",
				"asset_name": "Encore GX - Avenir trim",
				"asset_type": "Social Static – In Feed",
				"placement": "Pinterest",
				"duration": "Not relevant",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product-correct MY25 assets, utilize ST trim for Envista and Avenir trim for Encore GX, update creative copy elements, avoid lines around \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "2x3",
				"channel": "Pinterest",
				"delivery_deadline": "2025-09-30",
				"target_audience": "Not specified"
			},
			{
				"deliverable": "Static Social Content",
				"number": 1,
				"client_name": "Buick",
				"asset_name": "Encore GX - Avenir trim",
				"asset_type": "Social Static – In Feed",
				"placement": "Linkedin",
				"duration": "Not relevant",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product-correct MY25 assets, utilize ST trim for Envista and Avenir trim for Encore GX, update creative copy elements, avoid lines around \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "1x1",
				"channel": "LinkedIn",
				"delivery_deadline": "2025-09-30",
				"target_audience": "Not specified"
			},
			{
				"deliverable": "Static Social Content",
				"number": 1,
				"client_name": "Buick",
				"asset_name": "Envista - Standard Trim",
				"asset_type": "Social Static – In Feed",
				"placement": "Meta",
				"duration": "Not relevant",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product-correct MY25 assets, utilize ST trim for Envista and Avenir trim for Encore GX, update creative copy elements, avoid lines around \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "1x1",
				"channel": "Facebook",
				"delivery_deadline": "2025-10-31",
				"target_audience": "Not specified"
			},
			{
				"deliverable": "Static Social Content",
				"number": 1,
				"client_name": "Buick",
				"asset_name": "Envista - Standard Trim",
				"asset_type": "Social Static – Story",
				"placement": "Meta",
				"duration": "Not relevant",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product-correct MY25 assets, utilize ST trim for Envista and Avenir trim for Encore GX, update creative copy elements, avoid lines around \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "9x16",
				"channel": "Instagram",
				"delivery_deadline": "2025-10-31",
				"target_audience": "Not specified"
			},
			{
				"deliverable": "Static Social Content",
				"number": 1,
				"client_name": "Buick",
				"asset_name": "Envista - Standard Trim",
				"asset_type": "Social Static – In Feed",
				"placement": "Meta",
				"duration": "Not relevant",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product-correct MY25 assets, utilize ST trim for Envista and Avenir trim for Encore GX, update creative copy elements, avoid lines around \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "1x1",
				"channel": "Facebook",
				"delivery_deadline": "2025-10-31",
				"target_audience": "Not specified"
			},
			{
				"deliverable": "Static Social Content",
				"number": 1,
				"client_name": "Buick",
				"asset_name": "Envista - Standard Trim",
				"asset_type": "Social Static – In Feed",
				"placement": "Meta",
				"duration": "Not relevant",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product-correct MY25 assets, utilize ST trim for Envista and Avenir trim for Encore GX, update creative copy elements, avoid lines around \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "1x1",
				"channel": "Facebook",
				"delivery_deadline": "2025-10-31",
				"target_audience": "Not specified"
			},
			{
				"deliverable": "Static Social Content",
				"number": 1,
				"client_name": "Buick",
				"asset_name": "Envista - Standard Trim",
				"asset_type": "Social Static – In Feed",
				"placement": "Meta",
				"duration": "Not relevant",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product-correct MY25 assets, utilize ST trim for Envista and Avenir trim for Encore GX, update creative copy elements, avoid lines around \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "1x1",
				"channel": "Facebook",
				"delivery_deadline": "2025-10-31",
				"target_audience": "Not specified"
			},
			{
				"deliverable": "Static Social Content",
				"number": 1,
				"client_name": "Buick",
				"asset_name": "Envista - Standard Trim",
				"asset_type": "Social Static – Story",
				"placement": "Meta",
				"duration": "Not relevant",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product-correct MY25 assets, utilize ST trim for Envista and Avenir trim for Encore GX, update creative copy elements, avoid lines around \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "9x16",
				"channel": "Instagram",
				"delivery_deadline": "2025-10-31",
				"target_audience": "Not specified"
			},
			{
				"deliverable": "Static Social Content",
				"number": 1,
				"client_name": "Buick",
				"asset_name": "Envista - Standard Trim",
				"asset_type": "Social Static – Story",
				"placement": "Meta",
				"duration": "Not relevant",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product-correct MY25 assets, utilize ST trim for Envista and Avenir trim for Encore GX, update creative copy elements, avoid lines around \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "9x16",
				"channel": "Instagram",
				"delivery_deadline": "2025-10-31",
				"target_audience": "Not specified"
			},
			{
				"deliverable": "Static Social Content",
				"number": 1,
				"client_name": "Buick",
				"asset_name": "Envista - Standard Trim",
				"asset_type": "Social Static – Story",
				"placement": "Meta",
				"duration": "Not relevant",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product-correct MY25 assets, utilize ST trim for Envista and Avenir trim for Encore GX, update creative copy elements, avoid lines around \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "9x16",
				"channel": "Instagram",
				"delivery_deadline": "2025-10-31",
				"target_audience": "Not specified"
			},
			{
				"deliverable": "Static Social Content",
				"number": 1,
				"client_name": "Buick",
				"asset_name": "Envista - Standard Trim",
				"asset_type": "Social Static – In Feed",
				"placement": "Pinterest",
				"duration": "Not relevant",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product-correct MY25 assets, utilize ST trim for Envista and Avenir trim for Encore GX, update creative copy elements, avoid lines around \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "2x3",
				"channel": "Pinterest",
				"delivery_deadline": "2025-10-31",
				"target_audience": "Not specified"
			},
			{
				"deliverable": "Static Social Content",
				"number": 1,
				"client_name": "Buick",
				"asset_name": "Envista - Standard Trim",
				"asset_type": "Social Static – In Feed",
				"placement": "Pinterest",
				"duration": "Not relevant",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product-correct MY25 assets, utilize ST trim for Envista and Avenir trim for Encore GX, update creative copy elements, avoid lines around \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "2x3",
				"channel": "Pinterest",
				"delivery_deadline": "2025-10-31",
				"target_audience": "Not specified"
			},
			{
				"deliverable": "Static Social Content",
				"number": 1,
				"client_name": "Buick",
				"asset_name": "Envista - Standard Trim",
				"asset_type": "Social Static – In Feed",
				"placement": "Pinterest",
				"duration": "Not relevant",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product-correct MY25 assets, utilize ST trim for Envista and Avenir trim for Encore GX, update creative copy elements, avoid lines around \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "2x3",
				"channel": "Pinterest",
				"delivery_deadline": "2025-10-31",
				"target_audience": "Not specified"
			},
			{
				"deliverable": "Static Social Content",
				"number": 1,
				"client_name": "Buick",
				"asset_name": "Envista - Standard Trim",
				"asset_type": "Social Static – In Feed",
				"placement": "Linkedin",
				"duration": "Not relevant",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product-correct MY25 assets, utilize ST trim for Envista and Avenir trim for Encore GX, update creative copy elements, avoid lines around \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "1x1",
				"channel": "LinkedIn",
				"delivery_deadline": "2025-10-31",
				"target_audience": "Not specified"
			}
		],
		"historicalTimelinesFolderId": "1i005bIDW_G8ylk0X0m835K-4QLoSFKyg",
		"gaps": [
			"Specification of the exact deliverable quantity per platform.",
			"Clarification on which specific MY25 assets are considered 'product-correct'.",
			"Confirmation on whether the 'product-correct MY25 assets' should strictly depict the standard trim (ST) for Envista and the Avenir trim for Encore GX, or if variations are permitted.",
			"Details on the specific 'provided examples' for template usage.",
			"Clarification on the specific 'Social Platforms Preferences' beyond listing Facebook, Instagram, Pinterest & LinkedIn."
		],
		"additionalInfo": ""
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
