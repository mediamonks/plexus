const requestContext = require('../utils/request-context');
const Profiler = require('../utils/Profiler');
const invoke = require('../modules/invoke');

module.exports = async (_, payload) => {
	const { config } = payload;
	let error, output;
	
	await requestContext.run({ payload, config }, async () => {
		try {
			output = await Profiler.run(invoke, 'total');
		} catch (err) {
			console.error(err);
			error = err;
		}
	});
	
	return {
		error,
		output,
		payload,
		performance: Profiler.getReport(),
	};
};
