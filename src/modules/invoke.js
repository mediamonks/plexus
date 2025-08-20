const { v4: uuid } = require('uuid');
const Catalog = require('../entities/catalog/Catalog');
const requestContext = require('../utils/request-context');
const Profiler = require('../utils/Profiler');
const firestore = require('../services/firestore');
const History = require('../utils/History');
const config = require('../utils/config');

module.exports = async function invoke() {
	let { threadId } = requestContext.get().payload;
	
	let history;
	if (threadId) {
		const thread = await Profiler.run(() => firestore.getDocument('threads', threadId), 'retrieve thread');
		if (!thread) throw new Error('Error: Invalid threadId');
		({ history } = thread);
	}
	requestContext.get().history = new History(history ?? []);
	
	// const isFirstRun = !threadId;
	threadId ??= uuid();
	
	const catalog = requestContext.get().catalog = new Catalog();
	
	const { output, waitForThreadUpdate } = config.get();
	
	const result = {};
	try {
		if (output) await Promise.all(output.map(outputField =>
			catalog.get(outputField).getValue()
				.then(value => result[outputField] = value)
		));
	} catch (error) {
		throw error;
	}
	
	const threadUpdate = firestore.updateDocument('threads', threadId, {
		output: result,
		history: requestContext.get().history.toJSON(),
	});
	if (waitForThreadUpdate) await threadUpdate;
	
	return result;
};
