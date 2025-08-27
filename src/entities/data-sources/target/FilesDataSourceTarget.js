const DataSourceBehavior = require('../DataSourceBehavior');

class FilesDataSourceTarget extends DataSourceBehavior {
	async read() {
		return this.getItems();
	}
	
	async ingest() {
		// TODO ingest by copying files to own gcs
		return console.warn(`Not ingesting files target data source "${this.id}"`);
	}
	
	async query() {
		return this.getData();
	}
}

module.exports = FilesDataSourceTarget;
