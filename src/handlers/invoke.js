const Profiler = require('../utils/Profiler');
const invoke = require('../modules/invoke');
const Debug = require('../utils/Debug');
const History = require('../utils/History');

module.exports = async (_, payload) => {
	let error, output;
	
	try {
		output = await Profiler.run(invoke, 'total');
	} catch (err) {
		console.error(err);
		error = err;
	}
	
	return {
		error,
		output,
		threadId: History.instance.threadId,
		payload,
		performance: Profiler.getReport(),
		debug: Debug.get(),
	};
};
