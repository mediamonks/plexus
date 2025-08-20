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
		"config": {
			"output": [
				"outputQuote",
				"outputTimeline"
			]
		},
		"ratecardId": "1h8FmXH74feglI1GvOWIrZRzUCD7nA0EX",
		"deliverables": [
			{
				"deliverable": "Static social content",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Envista",
				"asset_type": "Social Static",
				"placement": "In Feed",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product imagery and copy. Depict Envista in ST trim.",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "1x1",
				"channel": "Meta",
				"delivery_deadline": 45930
			},
			{
				"deliverable": "Static social content",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Social Static",
				"asset_type": "Story - Static",
				"placement": "",
				"duration": "Adaptation of an existing visual",
				"creative_base": "Update product imagery and copy. Depict Envista in ST trim.",
				"changes_needed_on_creative_base": "Client provides final copy",
				"asset_copy": "9x16",
				"technical_specifications": "Meta",
				"channel": 45930
			},
			{
				"deliverable": "Static social content",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Envista",
				"asset_type": "Social Static",
				"placement": "Carousel",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product imagery and copy. Depict Envista in ST trim.",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "1x1",
				"channel": "Meta",
				"delivery_deadline": 45930
			},
			{
				"deliverable": "Static social content",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Envista",
				"asset_type": "Social Static",
				"placement": "Story Carousel",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product imagery and copy. Depict Envista in ST trim.",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "9x16",
				"channel": "Meta",
				"delivery_deadline": 45930
			},
			{
				"deliverable": "Static social content",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Envista",
				"asset_type": "Social Static",
				"placement": "Carousel",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product imagery and copy. Depict Envista in ST trim.",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "2x3",
				"channel": "Pinterest",
				"delivery_deadline": 45930
			},
			{
				"deliverable": "Static social content",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Envista",
				"asset_type": "Social Static",
				"placement": "Carousel",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product imagery and copy. Depict Envista in ST trim.",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "2x3",
				"channel": "Pinterest",
				"delivery_deadline": 45930
			},
			{
				"deliverable": "Static social content",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Envista",
				"asset_type": "Social Static",
				"placement": "Carousel",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product imagery and copy. Depict Envista in ST trim.",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "2x3",
				"channel": "Pinterest",
				"delivery_deadline": 45930
			},
			{
				"deliverable": "Static social content",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Envista",
				"asset_type": "Social Static",
				"placement": "Static",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product imagery and copy. Depict Envista in ST trim.",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "1x1",
				"channel": "Linkedin",
				"delivery_deadline": 45930
			},
			{
				"deliverable": "Static social content",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Envista",
				"asset_type": "Social Static",
				"placement": "In Feed",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product imagery and copy. Depict Envista in ST trim.",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "1x1",
				"channel": "Meta",
				"delivery_deadline": 45961
			},
			{
				"deliverable": "Static social content",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Envista",
				"asset_type": "Social Static",
				"placement": "Story - Static",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product imagery and copy. Depict Envista in ST trim.",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "9x16",
				"channel": "Meta",
				"delivery_deadline": 45961
			},
			{
				"deliverable": "Static social content",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Envista",
				"asset_type": "Social Static",
				"placement": "Carousel",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product imagery and copy. Depict Envista in ST trim.",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "1x1",
				"channel": "Meta",
				"delivery_deadline": 45961
			},
			{
				"deliverable": "Static social content",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Envista",
				"asset_type": "Social Static",
				"placement": "Story Carousel",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product imagery and copy. Depict Envista in ST trim.",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "9x16",
				"channel": "Meta",
				"delivery_deadline": 45961
			},
			{
				"deliverable": "Static social content",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Envista",
				"asset_type": "Social Static",
				"placement": "Static",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product imagery and copy. Depict Envista in ST trim.",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "2x3",
				"channel": "Pinterest",
				"delivery_deadline": 45961
			},
			{
				"deliverable": "Static social content",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Envista",
				"asset_type": "Social Static",
				"placement": "Carousel",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product imagery and copy. Depict Envista in ST trim.",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "2x3",
				"channel": "Pinterest",
				"delivery_deadline": 45961
			},
			{
				"deliverable": "Static social content",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Envista",
				"asset_type": "Social Static",
				"placement": "Carousel",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product imagery and copy. Depict Envista in ST trim.",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "2x3",
				"channel": "Pinterest",
				"delivery_deadline": 45961
			},
			{
				"deliverable": "Static social content",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Envista",
				"asset_type": "Social Static",
				"placement": "Static",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update product imagery and copy. Depict Envista in ST trim.",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "1x1",
				"channel": "Linkedin",
				"delivery_deadline": 45961
			},
			{
				"deliverable": "Link Post",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Encore GX",
				"asset_type": "Other",
				"placement": "",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update copy to mention \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "",
				"channel": "Meta",
				"delivery_deadline": 45930
			},
			{
				"deliverable": "Story",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Encore GX",
				"asset_type": "Social Static",
				"placement": "",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update copy to mention \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "",
				"channel": "Meta",
				"delivery_deadline": 45930
			},
			{
				"deliverable": "Carousel",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Encore GX",
				"asset_type": "Social Static",
				"placement": "",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update copy to mention \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "",
				"channel": "Meta",
				"delivery_deadline": 45930
			},
			{
				"deliverable": "Story Carousel",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Encore GX",
				"asset_type": "Social Static",
				"placement": "",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update copy to mention \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "",
				"channel": "Meta",
				"delivery_deadline": 45930
			},
			{
				"deliverable": "Static",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Encore GX",
				"asset_type": "Social Static",
				"placement": "",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update copy to mention \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "2x3",
				"channel": "Pinterest",
				"delivery_deadline": 45930
			},
			{
				"deliverable": "Carousel",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Encore GX",
				"asset_type": "Social Static",
				"placement": "",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update copy to mention \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "2x3",
				"channel": "Pinterest",
				"delivery_deadline": 45930
			},
			{
				"deliverable": "Carousel",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Encore GX",
				"asset_type": "Social Static",
				"placement": "",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update copy to mention \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "2x3",
				"channel": "Pinterest",
				"delivery_deadline": 45930
			},
			{
				"deliverable": "Static Pin",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Encore GX",
				"asset_type": "Social Static",
				"placement": "",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update copy to mention \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "",
				"channel": "Pinterest",
				"delivery_deadline": 45930
			},
			{
				"deliverable": "Carousel",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Encore GX",
				"asset_type": "Social Static",
				"placement": "",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update copy to mention \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "",
				"channel": "Pinterest",
				"delivery_deadline": 45930
			},
			{
				"deliverable": "Link Post",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Encore GX",
				"asset_type": "Other",
				"placement": "",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update copy to mention \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "",
				"channel": "Linkedin",
				"delivery_deadline": 45930
			},
			{
				"deliverable": "Static",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Encore GX",
				"asset_type": "Social Static",
				"placement": "",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update copy to mention \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "1x1",
				"channel": "Linkedin",
				"delivery_deadline": 45930
			},
			{
				"deliverable": "Link Post",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Encore GX",
				"asset_type": "Other",
				"placement": "",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update copy to mention \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "",
				"channel": "Meta",
				"delivery_deadline": 45961
			},
			{
				"deliverable": "Story",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Encore GX",
				"asset_type": "Social Static",
				"placement": "",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update copy to mention \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "",
				"channel": "Meta",
				"delivery_deadline": 45961
			},
			{
				"deliverable": "Carousel",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Encore GX",
				"asset_type": "Social Static",
				"placement": "",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update copy to mention \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "",
				"channel": "Meta",
				"delivery_deadline": 45961
			},
			{
				"deliverable": "Story Carousel",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Encore GX",
				"asset_type": "Social Static",
				"placement": "",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update copy to mention \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "",
				"channel": "Meta",
				"delivery_deadline": 45961
			},
			{
				"deliverable": "Static",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Encore GX",
				"asset_type": "Social Static",
				"placement": "",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update copy to mention \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "2x3",
				"channel": "Pinterest",
				"delivery_deadline": 45961
			},
			{
				"deliverable": "Carousel",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Encore GX",
				"asset_type": "Social Static",
				"placement": "",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update copy to mention \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "2x3",
				"channel": "Pinterest",
				"delivery_deadline": 45961
			},
			{
				"deliverable": "Carousel",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Encore GX",
				"asset_type": "Social Static",
				"placement": "",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update copy to mention \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "2x3",
				"channel": "Pinterest",
				"delivery_deadline": 45961
			},
			{
				"deliverable": "Static Pin",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Encore GX",
				"asset_type": "Social Static",
				"placement": "",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update copy to mention \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "",
				"channel": "Pinterest",
				"delivery_deadline": 45961
			},
			{
				"deliverable": "Carousel",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Encore GX",
				"asset_type": "Social Static",
				"placement": "",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update copy to mention \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "",
				"channel": "Pinterest",
				"delivery_deadline": 45961
			},
			{
				"deliverable": "Link Post",
				"number": "",
				"client_name": "Buick",
				"asset_name": "Encore GX",
				"asset_type": "Other",
				"placement": "",
				"duration": "",
				"creative_base": "Adaptation of an existing visual",
				"changes_needed_on_creative_base": "Update copy to mention \"modern technology\".",
				"asset_copy": "Client provides final copy",
				"technical_specifications": "",
				"channel": "Linkedin",
				"delivery_deadline": 45961
			}
		],
		"historicalTimelinesFolderId": "1GSK62Sg8zL1-BsTiPWwpdFj-wxVs55M_",
		"gaps": [
			"Specific deliverable quantities per platform for MY25 Envista & Encore GX.",
			"Specific video length desired for any video assets.",
			"Clarification on sourcing or creation of 'product-correct MY25 assets' for Envista (ST trim) and Encore GX (Avenir trim).",
			"Clearer guidance or examples on how to avoid the phrase 'modern technology' in creative copy.",
			"Confirmation of duration, territories, and purpose for digital rights of influencer content."
		],
		"additionalInfo": [
			"empty",
			"empty"
		]
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
