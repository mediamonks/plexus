const Agent = require('./Agent');

module.exports = class ProductAgent extends Agent {
	static _name = 'Product';
	static isRefinementAgent = true;
	
	async prepare() {
		this._inputData['productData'] = require(`../../../data/product-data/${this._context.brandId}.json`)
			.find(p => p['product_name'] === this._context.product);
	}
};
