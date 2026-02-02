import EventEmitter from 'node:events';
import Thread from './core/Thread';
import DataSources from './entities/data-sources/DataSources';
import CustomError from './entities/error-handling/CustomError';
import ErrorHandler from './entities/error-handling/ErrorHandler';
import { JsonObject } from './types/common';
import Configuration from './types/Configuration';
import RequestContext from './core/RequestContext';

export default class Plexus extends EventEmitter {
	private _threads: Thread[] = [];
	
	public static get instance(): Plexus {
		return RequestContext.get('plexus') as Plexus;
	}
	
	public constructor(private _config?: Configuration | string) {
		super();
		
		if (Plexus.instance) throw new CustomError('Only one instance of Plexus can be created. Use Plexus.instance to access the existing instance.');
		
		ErrorHandler.initialize();
		
		RequestContext.set('plexus', this);
	}
	
	public get config(): Configuration | string {
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
		return this.thread().invoke(fields);
	}
	
	public async ingest(namespace?: string): Promise<void> {
		return DataSources.ingest(namespace);
	}
}
