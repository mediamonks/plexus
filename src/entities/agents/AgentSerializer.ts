import Agent from './Agent';
import IAgent from './IAgent';
import Catalog from '../catalog/Catalog';
import ConfigurationError from '../error-handling/ConfigurationError';
import Console from '../../core/Console';
import { CatalogFieldValue, JsonObject } from '../../types/common';

export default class AgentSerializer implements IAgent {
	private readonly _id: string;
	private readonly _configuration: typeof Agent.Configuration;
	private _agents: Agent[];
	private _ready: Promise<void>;
	
	public constructor(id: string, configuration: typeof Agent.Configuration) {
		this._id = id;
		this._configuration = configuration;
	}
	
	public async prepare(catalog: Catalog): Promise<void> {
		const [collectionName, itemName] = this.parseSerialize();
		
		const collectionField = catalog.get(collectionName);
		this._ready = new Promise(async resolve => {
			const collection = await collectionField.getValue() as CatalogFieldValue[];
			
			if (!Array.isArray(collection)) throw new ConfigurationError(`Serialize field "${collectionName}" of agent "${this._id}" must be an array`);
			
			// TODO: Dynamic import to break circular dependency (Catalog > OutputCatalogField > Agents > AgentSerializer > ScopedCatalog > Catalog). Needs proper fix.
			const { default: ScopedCatalog } = await import('../catalog/ScopedCatalog');
			
			this._agents = await Promise.all(collection.map(async item => {
				const agent = new Agent(this._id, this._configuration);
				const scopedCatalog = new ScopedCatalog(catalog);
				scopedCatalog.set(itemName, item, collectionField?.example?.[0]);
				await agent.prepare(scopedCatalog);
				return agent;
			}));
			
			resolve();
		});
	}
	
	public async invoke(): Promise<JsonObject> {
		await this._ready;
		
		const activity = Console.start(`Serializing agent "${this.id}"`, this._agents.length);
		const results = await Promise.all(this._agents.map(async agent => {
			const result = await agent.invoke();
			activity.progress();
			return result;
		}));
		activity.done();
		
		const combined: JsonObject = {};
		const keys = Object.keys(results[0]);
		for (const key of keys) {
			combined[key] = results.map(result => result[key]);
			if (combined[key][0] instanceof Array) combined[key] = combined[key].flat();
		}
		
		return combined;
	}
	
	private get configuration(): typeof Agent.Configuration {
		return this._configuration as typeof Agent.Configuration;
	}
	
	private get id(): string {
		return this._id;
	}
	
	private parseSerialize(): [string, string] {
		const { serialize } = this.configuration;
		
		if (serialize.includes(':')) return serialize.split(':') as [string, string];
		const result = /^(.+)s$/.exec(serialize);
		if (!result) throw new ConfigurationError(`Serialize field "${serialize}" of agent "${this._id}" must end with 's' or specify item name`);
		
		return [serialize, result[1]];
	}
}
