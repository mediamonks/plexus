const Agent = require('./Agent');

module.exports = class TargetAudienceAgent extends Agent {
	static _name = 'Target Audience';
	static isRefinementAgent = true;
};
