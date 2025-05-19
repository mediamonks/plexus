const DraftAgent = require('../agents/DraftAgent');
const FeedbackAgent = require('../agents/FeedbackAgent');
// TODO require agent only when needed?
const refinementAgents = [
	require('../agents/BrandAgent'),
];
const config = require('../../utils/config');
const History = require('../../utils/History');

module.exports = class Strategy {
	static _refinementAgents = refinementAgents;
	_activeAgents = [];
	_revisionRecord = [];
	_history;
	_context;
	_changedContext;
	_isFirstRun;
	
	constructor({
		history,
		context,
		changedContext,
		isFirstRun,
	}) {
		this._history = new History(history.toJSON());
		this._context = context;
		this._changedContext = changedContext;
		this._isFirstRun = isFirstRun;
	}
	
	static create(options) {
		return new this(options);
	}
	
	get refinementAgents() {
		return this.constructor._refinementAgents;
	}
	
	prepareAgents() {	}
	
	async invokeAgents() { }
	
	async execute() {
		const forceCopyBasedVectorSearch = config.get('forceCopyBasedVectorSearch');
		if (!this._isFirstRun || !forceCopyBasedVectorSearch) this.prepareAgents();
		
		let copy = this._context.copy;
		let textResponse, outputData;
		
		if (this._context.prompt || this._changedContext.includes('language') || this._changedContext.includes('temperature')) {
			const initialAgent = new (this._isFirstRun ? DraftAgent : FeedbackAgent)(this._context);
			outputData = await initialAgent.invoke({
				temperature: this._context.temperature,
				history: this._history,
				revisionRecord: this._revisionRecord,
			});
			({ copy, textResponse } = outputData);
			this._history.add('assistant', JSON.stringify(outputData));
		}
		
		if (this._isFirstRun && forceCopyBasedVectorSearch) {
			this._context.copy = copy;
			this.prepareAgents();
		}
		
		if (this._activeAgents.length && copy) copy = await this.invokeAgents(copy);
		
		return { copy, textResponse, revisionRecord: this._revisionRecord };
	}
}
