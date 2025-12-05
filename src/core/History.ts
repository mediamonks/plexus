import { v4 as uuid } from 'uuid';
import Config from './Config';
import Profiler from './Profiler';
import RequestContext from './RequestContext';
import CustomError from '../entities/error-handling/CustomError';
import Firestore from '../services/google-cloud/Firestore';
import { JsonObject } from '../types/common';

type HistoryItem = {
	role: string;
	parts: { text: string }[];
};

type OpenAIHistoryItem = {
	role: string;
	content: string;
	name?: string;
}

// TODO is this an entity?
export default class History {
	public ready: Promise<void>;
	private _history: HistoryItem[] = [];
	private _threadId: string;
	
	public static get instance(): History {
		return RequestContext.get('history') as History;
	}
	
	public static create(threadId?: string): History {
		const history = new this(threadId);
		RequestContext.set('history', history);
		return history;
	}
	
	public constructor (threadId?: string) {
		this._threadId = threadId;
		
		// TODO ready is not actually used, so race conditions can occur
		this.ready = this._load();
	}
	
	public get threadId(): string {
		return this._threadId ??= uuid();
	}
	
	private async _load(): Promise<void> {
		await Profiler.run(async () => {
			let history: HistoryItem[];
		
			if (this._threadId) {
				const thread = await Profiler.run(() => Firestore.getDocument('threads', this._threadId), 'retrieve thread');
				
				if (!thread) throw new CustomError('Invalid threadId');
				
				history = thread.history as HistoryItem[];
			}
			
			if (!history || !history.length) return;
			
			this._history = history;
		}, 'load history');
	}
	
	public async save(output: JsonObject): Promise<void> {
		const threadUpdate = Profiler.run(() => Firestore.updateDocument('threads', this.threadId, {
			output,
			history: this.toJSON(),
		}), 'update thread');
		
		if (Config.get('waitForThreadUpdate')) await threadUpdate;
	}
	
	public toVertexAi(): HistoryItem[] {
		return this._history;
	}
	
	public toOpenAi(): OpenAIHistoryItem[] {
		return this._history.map(item => ({
			role: item.role,
			content: item.parts[0].text
		}));
	}
	
	public fromOpenAi(history: OpenAIHistoryItem[]): void {
		this._history = history.map(item => ({
			role: item.role,
			parts: [{ text: item.content }]
		}));
	}
	
	public add(role: string, text: string): void {
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
