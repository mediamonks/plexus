const { v4: uuid } = require('uuid');
const Catalog = require('../entities/catalog/Catalog');
const config = require('../utils/config');
const History = require('../utils/History');
const RequestContext = require('../utils/RequestContext');

module.exports = async function invoke() {
	let { threadId } = RequestContext.get('payload');
	
	History.create(threadId);
	
	const output = config.get('output');
	
	if (!output || !output.length) throw new Error('No output specified');
	
	const result = {};
	await Promise.all(output.map(async outputField => {
		result[outputField] = await Catalog.instance.get(outputField).getValue();
	}));
	
	History.instance.save(result);
	
	return result;
};
