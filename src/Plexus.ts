import EventEmitter from 'node:events';
import Config from './core/Config';
import Thread from './core/Thread';
import RequestContext from './core/RequestContext';
import DataSources from './entities/data-sources/DataSources';
import ErrorHandler from './entities/error-handling/ErrorHandler';
import { JsonObject } from './types/common';
import Configuration from './types/Configuration';

export default class Plexus extends EventEmitter {
	private _config: Configuration;
	private _threads: Thread[] = [];
	
	public static get instance(): Plexus {
		return RequestContext.get('plexus') as Plexus;
	}
	
	public constructor(config?: Configuration | string) {
		super();
		
		this._config = Config.parse(config);
	}
	
	public get config(): Configuration {
		return this._config;
	}
	
	public thread(threadId?: string): Thread {
		return this._threads[threadId] ??= new Thread(threadId);
	}
	
	public async invoke(fields: JsonObject): Promise<{
		output: JsonObject;
		threadId: string;
		fields: JsonObject;
	}> {
		return this.run(() => this.thread().invoke(fields));
	}
	
	public async ingest(namespace?: string): Promise<void> {
		return this.run(() => DataSources.ingest(namespace));
	}
	
	private run<T>(fn: () => T): T {
		return RequestContext.create({ plexus: this }, () => {
			ErrorHandler.initialize();
			return fn();
		});
	}
}
