const Agent = require('./Agent');
const vectordb = require('../vectordb');
const config = require('../../utils/config');
const jsonl = require('../../utils/jsonl');
const storage = require('../../services/storage');

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
		
		
		
		const examples = jsonl.read(await storage.cache(`grounding/${this._context.brandId}/examples.jsonl`));
		
		const data = [];
		for await (const item of examples) {
			if (item['channel'] === this._context.channel) data.push(item);
		}
		
		this._inputData['channelContext'] = data
			.sort((a, b) => b.engagement_rate - a.engagement_rate)
			.slice(0, channelContextTopN ?? 3)
			.map(item => item['text'])
			.join('\n\n');
	}
};
