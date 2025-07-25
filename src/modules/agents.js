const Agent = require('./Agent');
const requestContext = require('../utils/request-context');

function get(name) {
	// console.debug('retrieving agent');
	const agents = requestContext.get().agents ??= {};
	return agents[name] ??= new Agent(name);
}

module.exports = { get };
