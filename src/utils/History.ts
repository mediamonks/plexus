import { v4 as uuid } from 'uuid';
import firestore from '../services/firestore';
import config from './config';
import Profiler from './Profiler';
import RequestContext from './RequestContext';

export default class History {
	_history: { role: string; parts: { text: string }[] }[] = [];
	_threadId: string;
	_ready: Promise<void>;
	
	static get instance() {
		return RequestContext.get('history') as History;
	}
	
	static create(threadId?: string): History {
		const history = new this(threadId);
		RequestContext.set('history', history);
		return history;
	}
	
	constructor (threadId?: string) {
		this._threadId = threadId;
		
		// TODO _ready is not actually used, so race conditions can occur
		this._ready = this._load();
	}
	
	get threadId() {
		return this._threadId ??= uuid();
	}
	
	async _load(): Promise<void> {
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
	
	async save(result: any): Promise<void> {
		const threadUpdate = Profiler.run(() => firestore.updateDocument('threads', this._threadId, {
			output: result,
			history: this.toJSON(),
		}), 'update thread');
		
		if (config.get('waitForThreadUpdate')) await threadUpdate;
	}
	
	toVertexAi(): any[] {
		return this._history;
	}
	
	toOpenAi(): any[] {
		return this._history.map(item => ({
			role: item.role,
			content: item.parts[0].text
		}));
	}
	
	add(role: string, text: string): void {
		this._history.push({
			role,
			parts: [{ text }]
		})
	}
	
	toJSON(): any[] {
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
