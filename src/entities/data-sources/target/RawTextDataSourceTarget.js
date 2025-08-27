const DataSourceBehavior = require('../DataSourceBehavior');
const Storage = require('../../storage/Storage');
const StorageFile = require('../../storage/StorageFile');

class RawTextDataSourceTarget extends DataSourceBehavior {
	async read() {
		return this.getContents().join('\n\n');
	}
	
	async ingest() {
		const contents = await this.read();
		return Storage.get(StorageFile.TYPE.UNSTRUCTURED_DATA, this.id).ingest(contents);
	}
	
	async query() {
		return this.getData();
	}
}

module.exports = RawTextDataSourceTarget;
