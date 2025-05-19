const Strategy = require('./Strategy');
const strategies = {
	parallel: require('./Parallel'), // TODO require strategy only when needed?
	serial: require('./Serial'),
};
const config = require('../../utils/config');

module.exports = class Auto extends Strategy {
	static create({
			context,
			changedContext,
			isFirstRun,
			...options
	}) {
		const effectiveContext = isFirstRun ? Object.keys(context).filter(key => context[key]) : changedContext;
		const effectiveAgents = this._refinementAgents.filter(agent => effectiveContext.includes(agent.contextFieldName));
		const strategy = effectiveAgents.length > 2 ? 'parallel' : 'serial';
		
		config.set('strategy', strategy);
		
		return new strategies[strategy]({
			context,
			changedContext,
			isFirstRun,
			...options
		});
	}
}
