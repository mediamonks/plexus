const Strategy = require('./Strategy');
const ConsolidationAgent = require('../agents/ConsolidationAgent');

module.exports = class Parallel extends Strategy {
	prepareAgents() {
		this._activeAgents = this.refinementAgents
				.filter(agent => this._context[agent.contextFieldName])
				.map(agent => new agent(this._context));
	}
	
	async invokeAgents(copy) {
		const agentOutputs = {};
		await Promise.all(this._activeAgents.map(async agent =>
				agentOutputs[agent.dataFieldName] = await agent.invoke({
					input: { copy },
					revisionRecord: this._revisionRecord
				})));
		
		const consolidationAgent = new ConsolidationAgent(this._context);
		({ copy } = await consolidationAgent.invoke({
			input: { agent_outputs: agentOutputs },
			revisionRecord: this._revisionRecord
		}));
		
		return copy;
	}
}
