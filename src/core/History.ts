import { v4 as uuid } from 'uuid';
import Config from './Config';
import Profiler from './Profiler';
import RequestContext from './RequestContext';
import CustomError from '../entities/error-handling/CustomError';
import Firestore from '../services/google-cloud/Firestore';
import { JsonObject } from '../types/common';
import Thread from './Thread';

type HistoryItem = {
	role: 'user' | 'model';
	parts: { text: string }[];
};

type OpenAIHistoryItem = {
	role: 'system' | 'user' | 'assistant';
	content: string;
	name?: string;
}

// TODO is this an entity?
export default class History {
	public ready: Promise<void>;
	private _history: HistoryItem[] = [];
	private _threadId: string;
	
	public static get instance(): History {
		return (RequestContext.get('thread') as Thread)?.history;
	}
	
	public static create(threadId?: string): History {
		const history = new this(threadId);
		RequestContext.set('history', history);
		return history;
	}
	
	public constructor (threadId?: string) {
		this._threadId = threadId;
		
		// TODO ready is not actually used, so race conditions can occur
		this.ready = this.load();
	}
	
	public get threadId(): string {
		return this._threadId ??= uuid();
	}
	
	private async load(): Promise<void> {
		let history: HistoryItem[];
		
		if (this._threadId) {
			await Profiler.run(async () => {
				const thread = await Profiler.run(() => Firestore.getDocument('threads', this._threadId), 'retrieve thread');
				
				if (!thread) throw new CustomError('Invalid threadId');
				
				history = thread.history as HistoryItem[];
			}, 'History.load');
		}
		
		if (!history || !history.length) return;
		
		this._history = history;
	}
	
	public async save(output: JsonObject): Promise<void> {
		const threadUpdate = Profiler.run(() => Firestore.updateDocument('threads', this.threadId, {
			output: JSON.stringify(output),
			history: this.toJSON(),
		}), 'update thread');
		
		if (Config.get('waitForThreadUpdate')) await threadUpdate;
	}
	
	public toGemini(): HistoryItem[] {
		return this._history;
	}
	
	public toOpenAi(): OpenAIHistoryItem[] {
		return this._history.map(item => ({
			role: item.role === 'model' ? 'assistant' : 'user',
			content: item.parts[0].text
		}));
	}
	
	public fromOpenAi(history: OpenAIHistoryItem[]): void {
		this._history = history.map(item => ({
			role: item.role === 'assistant' ? 'model' : 'user',
			parts: [{ text: item.content }]
		}));
	}
	
	public add(role: 'model' | 'user', text: string): void {
		this._history.push({
			role,
			parts: [{ text }]
		})
	}
	
	public toJSON(): HistoryItem[] {
		return this._history;
	}
	
	public get length(): number {
		return this._history.length;
	}
	
	public get last(): HistoryItem {
		return this._history[this._history.length - 1];
	}
}
