const DataSourceBehavior = require('../DataSourceBehavior');

class ProfileDataSourceTarget extends DataSourceBehavior {
	async read() {
		throw new Error('Not implemented')
	}
	
	async ingest() {
		throw new Error('Not implemented');
	}
	
	async query() {
		throw new Error('Not implemented');
	}
}

module.exports = ProfileDataSourceTarget;
