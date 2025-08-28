import DataSource from './DataSource';
import config from '../../utils/config';
import hash from '../../utils/hash';
import RequestContext from '../../utils/RequestContext';
import UnknownError from '../../utils/UnknownError';

class DataSources {
	static _configuration;
	static _dataSources = {};
	
	static get configuration() {
		return config.get('data-sources');
	}
	
	static get dataSources() {
		return RequestContext.get('dataSources', {});
	}
	
	static get ids() {
		return Object.keys(this.configuration);
	}
	
	static get(id: string): DataSource {
		if (this.dataSources[id]) return this.dataSources[id];
		
		const dataSourceConfiguration = this.configuration[id];
		
		if (!dataSourceConfiguration) throw new UnknownError('data source', id, this.configuration);
		
		const key = hash(id, JSON.stringify(dataSourceConfiguration));
		
		this.dataSources[id] = this._dataSources[key] ?? new DataSource(id, dataSourceConfiguration);
		
		if (!this.dataSources[id].isDynamic) this._dataSources[key] = this.dataSources[id];
		
		return this.dataSources[id];
	}
	
	static async ingest(namespace?: string): Promise<void> {
		await Promise.all(this.ids.map(id => {
			if (namespace && this.configuration[id].namespace !== namespace) return;
			
			return this.get(id).ingest();
		}));
	}
}

export default DataSources;
