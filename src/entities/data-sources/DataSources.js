const DataSource = require('./DataSource');
const config = require('../../utils/config');

class DataSources {
	static _configuration;
	static _dataSources = {};
	
	static get configuration() {
		return this._configuration ??= config.get('data-sources');
	}
	
	static get(id) {
		return DataSources._dataSources[id] ??= new DataSource(id);
	}
	
	static async ingest(namespace) {
		await Promise.all(Object.keys(this.configuration).map(id => {
			if (namespace && this.configuration[id].namespace !== namespace) return;
			
			return this.get(id).ingest();
		}));
	}
}

module.exports = DataSources;
