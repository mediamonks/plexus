import Config from './Config';
import History from './History';
import Plexus from '../Plexus';
import CustomError from '../entities/error-handling/CustomError';
import Catalog from '../entities/catalog/Catalog';
import { JsonObject } from '../types/common';
import RequestContext from './RequestContext';

export default class Thread {
	public constructor(private _plexus: Plexus, private _threadId?: string) {}
	
	private _history: History;
	
	public get history(): History {
		return this._history ??= new History();
	}
	
	public async invoke(fields: JsonObject): Promise<{
		output: JsonObject;
		threadId: string;
		fields: JsonObject;
	}> {
		return this._plexus.context(async () => {
			RequestContext.set('fields', fields);
			
			const output = {};
			
			this._history = History.create(this._threadId);
			
			const outputFields = Config.get('output') as string[];
			
			if (!outputFields || !outputFields.length) throw new CustomError('No output specified');
			
			await Promise.all(outputFields.map(async outputField => {
				output[outputField] = await Catalog.instance.get(outputField).toJSON();
			}));
			
			await this.history.save(output);
			
			this._threadId = this.history.threadId;
			
			return {
				output,
				threadId: this._threadId,
				fields: fields,
			};
		});
	}
}
