const Agent = require('./Agent');
const requestContext = require('../../utils/request-context');

class Agents {
	static get(id) {
		const agents = requestContext.get().agents ??= {};
		return agents[id] ??= new Agent(id);
	}
}

module.exports = Agents;
