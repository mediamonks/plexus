const Agent = require('./Agent');
const vectordb = require('../vectordb');
const config = require('../../utils/config');
const jsonl = require('../../utils/jsonl');

module.exports = class ChannelAgent extends Agent {
	static _name = 'Channel';
	static isRefinementAgent = true;
	
	async prepare() {
		const embeddingsQuery = this._context.copy ?? this._context.prompt;
		const {
			channelContextTopN,
			simpleChannelContext,
			embeddingModel
		} = config.get();
		
		let query;
		if (simpleChannelContext) {
			query = (async () => {
				const data = [];
				for await (const item of jsonl.read(`./data/grounding/${this._context.brandId}/social-media.jsonl`)) {
					if (item['channel'] === this._context.channel) data.push(item);
				}
				return data;
			})();
		} else {
			query = vectordb.search(
					`${this._context.brandId}-structured`,
					await vectordb.generateQueryEmbeddings(embeddingsQuery, { model: embeddingModel }),
					{
						limit: 100,
						filter: { channel: this._context.channel },
						fields: ['text', 'engagement_rate']
					},
			);
		}
		// TODO catch for no channel-specific context
		
		return query.then(data => {
			this._inputData['channelContext'] = data
				.sort((a, b) => b.engagement_rate - a.engagement_rate)
				.slice(0, channelContextTopN ?? 3)
				.map(item => item['text'])
				.join('\n\n');
		});
	}
};
