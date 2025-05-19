const uuid = require('uuid').v4;
const strategies = {
	auto: require('./strategies/Auto'),
	parallel: require('./strategies/Parallel'),
	serial: require('./strategies/Serial'),
};
const firestore = require('../services/firestore');
const config = require('../utils/config');
const Debug = require('../utils/Debug');
const History = require('../utils/History');
const Profiler = require('../utils/Profiler');

module.exports = async function generate({
	threadId,
	context,
}) {
	const changedContext = [];
	let history;
	if (threadId) {
		const thread = await Profiler.run(() => firestore.getDocument('threads', threadId), 'retrieve thread');
		if (!thread) throw new Error('Error: Invalid threadId');
		({ history } = thread);
		context.copy = thread.copy;
		for (const key in context) if (context[key] !== thread.context[key]) changedContext.push(key);
	}
	history = new History(history ?? []);
	
	const isFirstRun = !threadId;
	threadId ??= uuid();
	
	const { strategy, waitForThreadUpdate } = config.get();
	if (!strategies[strategy]) throw new Error(`Invalid strategy selection: "${strategy}". Must be either "serial", "parallel" or "auto".`);
	
	const { copy, textResponse, revisionRecord } = await strategies[strategy]
		.create({
			history,
			context,
			changedContext,
			isFirstRun,
		})
		.execute()
	;
	
	if (context.prompt) history.add('user', context.prompt);
	history.add('assistant', JSON.stringify({ copy, textResponse }));
	
	const threadUpdate = firestore.updateDocument('threads', threadId, { history: history.toJSON(), context, copy });
	if (waitForThreadUpdate) await threadUpdate;
	
	const effectiveOptions = config.get();
	const performance = Profiler.getReport();
	
	firestore.createDocument('metrics', { copy, context, effectiveOptions, performance }).then();
	
	return {
		copy,
		textResponse,
		threadId,
		revisionRecord,
		config: config.get(),
		debugInfo: {
			history: history.toOpenAi(),
			debug: Debug.get(),
			performance,
		}
	};
};
