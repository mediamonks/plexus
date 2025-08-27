const DataSource = require('./DataSource');
const config = require('../../utils/config');
const hash = require('../../utils/hash');
const RequestContext = require('../../utils/RequestContext');
const UnknownError = require('../../utils/UnknownError');

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
	
	static get(id) {
		if (this.dataSources[id]) return this.dataSources[id];
		
		const dataSourceConfiguration = this.configuration[id];
		
		if (!dataSourceConfiguration) throw new UnknownError('data source', id, this.configuration);
		
		const key = hash(id, JSON.stringify(dataSourceConfiguration));
		
		this.dataSources[id] = this._dataSources[key] ?? new DataSource(id, dataSourceConfiguration);
		
		if (!this.dataSources[id].isDynamic) this._dataSources[key] = this.dataSources[id];
		
		return this.dataSources[id];
	}
	
	static async ingest(namespace) {
		await Promise.all(this.ids.map(id => {
			if (namespace && this.configuration[id].namespace !== namespace) return;
			
			return this.get(id).ingest();
		}));
	}
}

module.exports = DataSources;
