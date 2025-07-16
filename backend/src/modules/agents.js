const Agent = require('./Agent');
const agents = {};

function get(name) {
	// console.debug('retrieving agent');
	return agents[name] ??= new Agent(name);
}

module.exports = { get };
