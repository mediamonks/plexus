const Agent = require('./Agent');

module.exports = class DraftAgent extends Agent {
	static _name = 'Draft';
	
	async prepare() {
		this._inputData['userRequest'] = this._context.prompt;
	}
};
