import DataSource from './DataSource';
import config from '../../utils/config';
import ErrorLog from '../../utils/ErrorLog';
import hash from '../../utils/hash';
import RequestContext from '../../utils/RequestContext';
import UnknownError from '../../utils/UnknownError';

export default class DataSources {
	static readonly Configuration: Record<string, typeof DataSource.Configuration>;

	private static readonly _dataSources: Record<string, DataSource> = {};
	
	public static get configuration(): typeof DataSources.Configuration {
		return config.get('data-sources') as typeof DataSources.Configuration;
	}
	
	public static get dataSources(): Record<string, DataSource> {
		return RequestContext.get('dataSources', {}) as Record<string, DataSource>;
	}
	
	public static get ids(): string[] {
		return Object.keys(this.configuration);
	}
	
	public static get(id: string): DataSource {
		if (this.dataSources[id]) return this.dataSources[id];
		
		const dataSourceConfiguration = this.configuration[id];
		
		if (!dataSourceConfiguration) ErrorLog.throw(new UnknownError('data source', id, this.configuration));
		
		const key = hash(id, JSON.stringify(dataSourceConfiguration));
		
		this.dataSources[id] = this._dataSources[key] ?? new DataSource(id, dataSourceConfiguration);
		
		if (!this.dataSources[id].isDynamic) this._dataSources[key] = this.dataSources[id];
		
		return this.dataSources[id];
	}
	
	public static async ingest(namespace?: string): Promise<void> {
		await Promise.all(this.ids.map(id => {
			if (namespace && this.configuration[id].namespace !== namespace) return;
			
			return this.get(id).ingest();
		}));
	}
}
