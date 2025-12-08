import DataSource from './DataSource';
import DataVectorTargetDataSource from './target/DataVectorTargetDataSource';
import DigestTargetDataSource from './target/DigestTargetDataSource';
import FileTargetDataSource from './target/FileTargetDataSource';
import RawDataTargetDataSource from './target/RawDataTargetDataSource';
import RawTextTargetDataSource from './target/RawTextTargetDataSource';
import TextVectorTargetDataSource from './target/TextVectorTargetDataSource';
import UnknownError from '../error-handling/UnknownError';
import UnsupportedError from '../error-handling/UnsupportedError';
import Config from '../../core/Config';
import Debug from '../../core/Debug';
import hash from '../../utils/hash';
import Profiler from '../../core/Profiler';
import RequestContext from '../../core/RequestContext';
import { JsonObject } from '../../types/common';

export default class DataSources {
	static readonly Configuration: Record<string, typeof DataSource.ShorthandConfiguration>;

	private static readonly _dataSources: Record<string, DataSource> = {};
	
	public static get configuration(): typeof DataSources.Configuration {
		return Config.get('data-sources');
	}
	
	public static get dataSources(): Record<string, DataSource> {
		return RequestContext.get('dataSources', {}) as Record<string, DataSource>;
	}
	
	public static get ids(): string[] {
		return Object.keys(this.configuration);
	}
	
	public static get(id: string): DataSource {
		Debug.log(`Requesting data source "${id}"`, 'DataSources');
		
		if (this.dataSources[id]) {
			Debug.log(`Returning data source "${id}" from request cache`, 'DataSources');
			return this.dataSources[id];
		}
		
		const dataSourceConfiguration = this.configuration[id];
		
		if (!dataSourceConfiguration) throw new UnknownError('data source', id, this.configuration);
		
		Debug.dump(`Data source "${id}" configuration`, dataSourceConfiguration);
		
		const key = hash(id, JSON.stringify(dataSourceConfiguration));
		
		if (this._dataSources[key]) {
			Debug.log(`Returning data source "${id}" from memory cache`, 'DataSources');
		}
		
		this.dataSources[id] = this._dataSources[key] ?? this.create(id, dataSourceConfiguration);
		
		if (!this.dataSources[id].isDynamic) this._dataSources[key] = this.dataSources[id];
		
		return this.dataSources[id];
	}
	
	public static async ingest(namespace?: string): Promise<void> {
		await Promise.all(this.ids.map(id => {
			if (namespace && this.configuration[id].namespace !== namespace) return;
			
			return Profiler.run(() => this.get(id).ingest(), `ingest data source "${id}"`);
		}));
	}
	
	private static create(id: string, configuration: typeof DataSource.ShorthandConfiguration): DataSource {
		Debug.log(`Instantiating data source "${id}"`, 'DataSources');
		
		let { target, dataType } = DataSource.parseConfiguration(configuration);
		
		target ??= DataSource.TARGET.RAW;
		
		let instance = {
			[DataSource.TARGET.DIGEST]: new DigestTargetDataSource(id, configuration),
			[DataSource.TARGET.FILE]: new FileTargetDataSource(id, configuration),
			[DataSource.TARGET.FILES]: new FileTargetDataSource(id, configuration), // TODO for backwards compatibility
			[DataSource.TARGET.RAW]: {
				[DataSource.DATA_TYPE.STRUCTURED]: new RawDataTargetDataSource(id, configuration),
				[DataSource.DATA_TYPE.UNSTRUCTURED]: new RawTextTargetDataSource(id, configuration),
			},
			[DataSource.TARGET.VECTOR]: {
				[DataSource.DATA_TYPE.STRUCTURED]: new DataVectorTargetDataSource(id, configuration),
				[DataSource.DATA_TYPE.UNSTRUCTURED]: new TextVectorTargetDataSource(id, configuration),
			},
		}[target];
		
		if (!instance) {
			throw new UnsupportedError('data source target', target, Object.values(DataSource.TARGET));
		}
		
		if (!(instance instanceof DataSource)) {
			if (!instance[dataType]) {
				throw new UnsupportedError(`data source data type for target "${target}"`, dataType, Object.keys(instance));
			}
			
			instance = instance[dataType];
		}
		
		return instance;
	}
};
