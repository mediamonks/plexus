const Agent = require('./Agent');

module.exports = class ToneOfVoiceAgent extends Agent {
	static _name = 'Tone of Voice';
	static isRefinementAgent = true;
};
