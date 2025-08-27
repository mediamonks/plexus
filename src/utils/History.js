const { v4: uuid } = require('uuid');
const firestore = require('../services/firestore');
const config = require('./config');
const Profiler = require('./Profiler');
const RequestContext = require('./RequestContext');

class History {
	_history = [];
	_threadId;
	_ready;
	
	static get instance() {
		return RequestContext.get('history');
	}
	
	static create(threadId) {
		return RequestContext.set('history', new this(threadId));
	}
	
	constructor (threadId) {
		this._threadId = threadId;
		
		// TODO _ready is not actually used, so race conditions can occur
		this._ready = this._load();
	}
	
	get threadId() {
		return this._threadId ??= uuid();
	}
	
	async _load() {
		let history;
		
		if (this._threadId) {
			const thread = await Profiler.run(() => firestore.getDocument('threads', this._threadId), 'retrieve thread');
			
			if (!thread) throw new Error('Invalid threadId');
			
			({ history } = thread);
		}
		
		if (!history || !history.length) return;
		
		if (history[0].parts) {
			this._history = history;
			return;
		}
		
		this._history = history.map(item => ({
			role: item.role,
			parts: [{ text: item.content }]
		}));
	}
	
	async save(result) {
		const threadUpdate = Profiler.run(() => firestore.updateDocument('threads', this._threadId, {
			output: result,
			history: this.toJSON(),
		}), 'update thread');
		
		if (config.get('waitForThreadUpdate')) await threadUpdate;
	}
	
	toVertexAi() {
		return this._history;
	}
	
	toOpenAi() {
		return this._history.map(item => ({
			role: item.role,
			content: item.parts[0].text
		}));
	}
	
	add(role, text) {
		this._history.push({
			role,
			parts: [{ text }]
		})
	}
	
	toJSON() {
		return this._history;
	}
	
	get length() {
		return this._history.length;
	}
	
	get last() {
		const last = this._history[this._history.length - 1];
		return { role: last.role, content: last.parts[0].text };
	}
}

module.exports = History;
