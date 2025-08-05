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
	
	await invoke({
		'config': { 'output': ['followUp', 'outputDeliverables', 'validatedCriticalProductionBlockers', 'validatedImportantClarifications', 'validatedBriefInconsistencies'] },
		'briefFolderId': '1a2_DTNuBIfTFb8Spi6FnQWEt1abTzwgw',
		'outputFolderId': '1ew_B-BlwD_bCytp9NiJ_VJ5qcYRCazAE',
		'additionalInfo': [],
		'now': '2025-07-30T09:52:23.637Z'
	});
	
	// await invoke({
	// 	"config": {
	// 		"output": [
	// 			"outputQuote",
	// 			"outputTimeline"
	// 		]
	// 	},
	// 	"ratecardId": "14rWslvefv4NSEAHNT3jNHkVxiLUmHAjJ",
	// 	"deliverables": [
	// 		{
	// 			"deliverable": "1x update image assets",
	// 			"client_name": "GMC",
	// 			"asset_name": "24MY Sierra EV still photography asset",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "2x update image assets",
	// 			"client_name": "GMC",
	// 			"asset_name": "24MY Sierra EV still photography asset",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "3x update image assets",
	// 			"client_name": "GMC",
	// 			"asset_name": "24MY Sierra EV still photography asset",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "4x update image assets",
	// 			"client_name": "GMC",
	// 			"asset_name": "24MY Sierra EV still photography asset",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "5x update image assets",
	// 			"client_name": "GMC",
	// 			"asset_name": "24MY Sierra EV still photography asset",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "6x update image assets",
	// 			"client_name": "GMC",
	// 			"asset_name": "24MY Sierra EV still photography asset",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "7x update image assets",
	// 			"client_name": "GMC",
	// 			"asset_name": "24MY Sierra EV still photography asset",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "8x update image assets",
	// 			"client_name": "GMC",
	// 			"asset_name": "24MY Sierra EV still photography asset",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "9x update image assets",
	// 			"client_name": "GMC",
	// 			"asset_name": "24MY Sierra EV still photography asset",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "10x update image assets",
	// 			"client_name": "GMC",
	// 			"asset_name": "24MY Sierra EV still photography asset",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "11x update image assets",
	// 			"client_name": "GMC",
	// 			"asset_name": "24MY Sierra EV still photography asset",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "12x update image assets",
	// 			"client_name": "GMC",
	// 			"asset_name": "24MY Sierra EV still photography asset",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "13x update image assets",
	// 			"client_name": "GMC",
	// 			"asset_name": "24MY Sierra EV still photography asset",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "14x update image assets",
	// 			"client_name": "GMC",
	// 			"asset_name": "24MY Sierra EV still photography asset",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "15x update image assets",
	// 			"client_name": "GMC",
	// 			"asset_name": "24MY Sierra EV still photography asset",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "16x update image assets",
	// 			"client_name": "GMC",
	// 			"asset_name": "24MY Sierra EV still photography asset",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "17x update image assets",
	// 			"client_name": "GMC",
	// 			"asset_name": "24MY Sierra EV still photography asset",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "18x update image assets",
	// 			"client_name": "GMC",
	// 			"asset_name": "24MY Sierra EV still photography asset",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "19x update image assets",
	// 			"client_name": "GMC",
	// 			"asset_name": "24MY Sierra EV still photography asset",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "20x update image assets",
	// 			"client_name": "GMC",
	// 			"asset_name": "24MY Sierra EV still photography asset",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "21x update image assets",
	// 			"client_name": "GMC",
	// 			"asset_name": "24MY Sierra EV still photography asset",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "22x update image assets",
	// 			"client_name": "GMC",
	// 			"asset_name": "24MY Sierra EV still photography asset",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "23x update image assets",
	// 			"client_name": "GMC",
	// 			"asset_name": "24MY Sierra EV still photography asset",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "24x update image assets",
	// 			"client_name": "GMC",
	// 			"asset_name": "24MY Sierra EV still photography asset",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "25x update image assets",
	// 			"client_name": "GMC",
	// 			"asset_name": "24MY Sierra EV still photography asset",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "26x update image assets",
	// 			"client_name": "GMC",
	// 			"asset_name": "24MY Sierra EV still photography asset",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "27x update image assets",
	// 			"client_name": "GMC",
	// 			"asset_name": "24MY Sierra EV still photography asset",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "28x update image assets",
	// 			"client_name": "GMC",
	// 			"asset_name": "24MY Sierra EV still photography asset",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "29x update image assets",
	// 			"client_name": "GMC",
	// 			"asset_name": "24MY Sierra EV still photography asset",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "30x update image assets",
	// 			"client_name": "GMC",
	// 			"asset_name": "24MY Sierra EV still photography asset",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "31x update image assets",
	// 			"client_name": "GMC",
	// 			"asset_name": "24MY Sierra EV still photography asset",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "32x update image assets",
	// 			"client_name": "GMC",
	// 			"asset_name": "24MY Sierra EV still photography asset",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "33x update image assets",
	// 			"client_name": "GMC",
	// 			"asset_name": "24MY Sierra EV still photography asset",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "34x update image assets",
	// 			"client_name": "GMC",
	// 			"asset_name": "24MY Sierra EV still photography asset",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "1x additional images",
	// 			"client_name": "GMC",
	// 			"asset_name": "additional image",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "2x additional images",
	// 			"client_name": "GMC",
	// 			"asset_name": "additional image",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "3x additional images",
	// 			"client_name": "GMC",
	// 			"asset_name": "additional image",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		},
	// 		{
	// 			"deliverable": "4x additional images",
	// 			"client_name": "GMC",
	// 			"asset_name": "additional image",
	// 			"asset_type": "Retouching",
	// 			"duration": "Not relevant",
	// 			"creative_base": "Adaptation of an existing visual",
	// 			"changes_needed_on_creative_base": "Update existing 24MY Sierra EV still photography assets to be product correct for 25MY.",
	// 			"asset_copy": "Not needed",
	// 			"technical_specifications": "Not specified",
	// 			"channel": "Not specified",
	// 			"delivery_deadline": 45900,
	// 			"target_audience": "New vehicle shoppers"
	// 		}
	// 	],
	// 	"historicalTimelinesFolderId": "1l_CuYFLmo1ExWkn-3zcanMYNdGGZIc4b",
	// 	"gaps": [
	// 		"Specific list of the 34 existing still photography assets that require updates.",
	// 		"Specific marketing and PI comments/instructions for each of the 34 assets to be updated.",
	// 		"Specifications or creative brief for the '+4 additional images'.",
	// 		"Confirmation of the project timeline and specific 'run' dates for the assets."
	// 	],
	// 	"additionalInfo": ""
	// });
	
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
