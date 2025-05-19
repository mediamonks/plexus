const Agent = require('./Agent');
const requestContext = require('../../utils/request-context');
const vectordb = require('../vectordb');
const config = require('../../utils/config');

module.exports = class FeedbackAgent extends Agent {
	static _name = 'Feedback';
	
	async prepare() {
		this._inputData['userRequest'] = this._context.prompt;
		this._inputData['copy'] = this._context.copy;
		const embeddingsQuery = this._context.prompt ?? this._context.copy;
		const { disableBrandContext, brandContextTopN, embeddingModel } = config.get();
		
		return disableBrandContext || vectordb.search(
			`${this._context.brandId}-unstructured`,
			await vectordb.generateQueryEmbeddings(embeddingsQuery, { model: embeddingModel }),
			{ limit: brandContextTopN ?? 3 }
		).then(data => this._inputData['brandContext'] = data.join('\n\n'));
	}
};
