import Config from './Config';
import History from './History';
import RequestContext from './RequestContext';
import Plexus from '../Plexus';
import CustomError from '../entities/error-handling/CustomError';
import ErrorHandler from '../entities/error-handling/ErrorHandler';
import Catalog from '../entities/catalog/Catalog';
import { JsonObject } from '../types/common';

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
		const plexus = this._plexus;
		const config = this._plexus.config;
		return RequestContext.create({ plexus, config, fields }, async () => {
			ErrorHandler.initialize();
			
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
