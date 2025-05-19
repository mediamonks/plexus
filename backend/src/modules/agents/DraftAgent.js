const Agent = require('./Agent');
const vectordb = require('../vectordb');
const config = require('../../utils/config');
const jsonl = require('../../utils/jsonl');
const storage = require('../../services/storage');

const OFFER_TYPES = {
	BOGO: 'BOGO',
	FREE_ITEM: 'Free Item',
	PERCENT_OFF: '% Off',
	DOLLAR_OFF: '$ Off',
};

const SECTIONS = {
	SL: 'Email Subject Line',
	PH: 'Email Preheader',
	HL: 'Email Hero Headline',
	SH: 'Email Hero Body / Subheader non-member',
	SM: 'Email Hero Body / Subheader member',
	HC: 'Email Hero CTA',
	MH: 'Email Member Acquisition Module Headline',
	MS: 'Email Member Acquisition Module Subcopy',
	MC: 'Email Member Acquisition Module CTA',
	BH: 'Billboard Headline',
	BB: 'Billboard Body',
	BC: 'Billboard CTA',
	NT: 'Push Notification Title',
	NB: 'Push Notification Body',
};

module.exports = class DraftAgent extends Agent {
	static _name = 'Draft';
	static contextFields = [
		'userRequest',
		'subTheme',
		'merchant',
		'product',
		'offerType',
		'offerAmount',
	];
	
	async prepare() {
		const embeddingsQuery = this._context.userRequest;
		
		if (!embeddingsQuery) return;
		
		const { disableBrandContext, brandContextTopN, examplesTopN, embeddingModel } = config.get();
		
		if (!disableBrandContext) {
			const data = await vectordb.search(
				`${this._context.brandId}-unstructured`,
				await vectordb.generateQueryEmbeddings(embeddingsQuery, { model: embeddingModel }),
				{ limit: brandContextTopN ?? 3, fields: ['text'] }
			);
			
			this._inputData['brandContext'] = data.map(item => item['text']).join('\n\n');
		}
		
		const examples = jsonl.read(await storage.cache(`grounding/${this._context.brandId}/examples.jsonl`));
		
		const data = {};
		for await (const item of examples) {
			if (item['subTheme'] !== this._context.subTheme && OFFER_TYPES[item['offerType']] !== this._context.offerType) continue;
			const { section, text } = item;
			data[SECTIONS[section]] ??= [];
			if (data[SECTIONS[section]].length >= examplesTopN) continue;
			data[SECTIONS[section]].push(text);
		}
		
		this._inputData['examples'] = data;
	}
};
