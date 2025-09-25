import { v4 as uuid } from 'uuid';
import config from './config';
import Profiler from './Profiler';
import RequestContext from './RequestContext';
import firestore from '../services/firestore';
import CustomError from '../entities/error-handling/CustomError';

export default class History {
	private _history: {
		role: string;
		parts: { text: string }[]
	}[] = [];
	private _threadId: string;
	private _ready: Promise<void>;
	
	public static get instance() {
		return RequestContext.get('history') as History;
	}
	
	public static create(threadId?: string): History {
		const history = new this(threadId);
		RequestContext.set('history', history);
		return history;
	}
	
	public constructor (threadId?: string) {
		this._threadId = threadId;
		
		// TODO _ready is not actually used, so race conditions can occur
		this._ready = Profiler.run(() => this._load(), 'load history');
	}
	
	public get threadId() {
		return this._threadId ??= uuid();
	}
	
	private async _load(): Promise<void> {
		let history;
		
		if (this._threadId) {
			const thread = await Profiler.run(() => firestore.getDocument('threads', this._threadId), 'retrieve thread');
			
			if (!thread) throw new CustomError('Invalid threadId');
			
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
	
	public async save(output: any): Promise<void> {
		const threadUpdate = Profiler.run(() => firestore.updateDocument('threads', this._threadId, {
			output,
			history: this.toJSON(),
		}), 'update thread');
		
		if (config.get('waitForThreadUpdate')) await threadUpdate;
	}
	
	public toVertexAi(): any[] {
		return this._history;
	}
	
	public toOpenAi(): any[] {
		return this._history.map(item => ({
			role: item.role,
			content: item.parts[0].text
		}));
	}
	
	public add(role: string, text: string): void {
		this._history.push({
			role,
			parts: [{ text }]
		})
	}
	
	public toJSON(): any[] {
		return this._history;
	}
	
	public get length() {
		return this._history.length;
	}
	
	public get last() {
		const last = this._history[this._history.length - 1];
		return { role: last.role, content: last.parts[0].text };
	}
}
