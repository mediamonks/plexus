const fs = require('node:fs/promises');
const Agent = require('./Agent');
const storage = require('../../services/storage');

module.exports = class BrandAgent extends Agent {
	static _name = 'Brand';
	static isRefinementAgent = true;
	static contextFields = [
		'subTheme',
		'merchant',
		'product',
		'offerType',
		'offerAmount',
	];
	
	async prepare() {
		return fs.readFile(await storage.cache(`grounding/${this._context.brandId}/brand-guidelines.txt`))
				.then(data => this._inputData['brandGuidelines'] = data.toString());
	}
};
