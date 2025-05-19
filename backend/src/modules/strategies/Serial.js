const Strategy = require('./Strategy');
const config = require('../../utils/config');

module.exports = class Parallel extends Strategy {
	prepareAgents() {
		this._activeAgents = this.refinementAgents
			.filter(agent => this._context[agent.contextFieldName]
					&& (this._isFirstRun || this._changedContext.includes(agent.contextFieldName))
			)
			.map(agent => new agent(this._context));
	}
	
	async invokeAgents(copy) {
		const ignoreFixedAgentOrder = config.get('ignoreFixedAgentOrder');
		const activeAgents = [...this._activeAgents];
		
		while (activeAgents.length) {
			for (let index = 0; index < activeAgents.length; index++) {
				const agent = activeAgents[index];
				
				if (ignoreFixedAgentOrder && !agent.isReady && activeAgents.length > 1) continue;
				
				activeAgents.splice(index, 1);
				
				const outputData = await agent.invoke({
					input: { copy },
					history: this._history
				});
				
				this._history.add('assistant', JSON.stringify(outputData));
				({ copy } = outputData);
			}
		}
		
		return copy;
	}
}
