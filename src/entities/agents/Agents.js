const Agent = require('./Agent');
const config = require('../../utils/config');
const hash = require('../../utils/hash');
const UnknownError = require('../../utils/UnknownError');

class Agents {
	static _agents = {};
	
	static get(id, catalog) {
		const configuration = config.get(`agents`);
		
		if (!configuration[id]) throw new UnknownError('agent', id, configuration);
		
		const agent = this._agents[hash(id, JSON.stringify(configuration[id]))] ??= new Agent(id, configuration[id]);
		
		agent.prepare(catalog);
		
		return agent;
	}
}

module.exports = Agents;
