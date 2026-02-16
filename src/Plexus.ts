import EventEmitter from 'node:events';
import Config from './core/Config';
import Debug, { DebugLogEntry } from './core/Debug';
import Profiler, { ProfilerLogEntry } from './core/Profiler';
import RequestContext from './core/RequestContext';
import Thread from './core/Thread';
import Agents from './entities/agents/Agents';
import Catalog from './entities/catalog/Catalog';
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
		// TODO: revisit thread caching - currently we don't cache when threadId is undefined
		// to avoid sharing state across parallel invocations. A proper solution would move
		// all mutable state (like _history) into RequestContext.
		if (!threadId) return new Thread(this);
		return this._threads[threadId] ??= new Thread(this, threadId);
	}
	
	public async invoke(fields: JsonObject): Promise<{
		output: JsonObject;
		threadId: string;
		fields: JsonObject;
	}> {
		return this.thread().invoke(fields);
	}
	
	public async ingest(namespace?: string): Promise<{
		performance?: ProfilerLogEntry[];
		debug?: DebugLogEntry[];
	}> {
		return this.context(async () => {
			await DataSources.ingest(namespace);
			
			return {
				performance: Config.get('profiling') ? Profiler.getReport() : undefined,
				debug: Config.get('debug') ? Debug.get() : undefined,
			}
		});
	};
	
	public context<T>(fn: () => T): T {
		return RequestContext.create({ plexus: this, config: this.config }, () => {
			ErrorHandler.initialize();
			return fn();
		});
	}
	
	public Agents = Agents;
	public Catalog = Catalog;
	public DataSources = DataSources;
}
