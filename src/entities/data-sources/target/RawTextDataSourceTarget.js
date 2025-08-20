const DataSourceBehavior = require('../DataSourceBehavior');
const { default: Storage, STORAGE_FILE_DATA_TYPE } = require('../../storage/Storage');

class RawTextDataSourceTarget extends DataSourceBehavior {
	async read() {
		return this.getContents().join('\n\n');
	}
	
	async ingest() {
		const contents = await this.read();
		return Storage.get(STORAGE_FILE_DATA_TYPE.TEXT, this.id).ingest(contents);
	}
	
	async query() {
		return this.getData();
	}
}

module.exports = RawTextDataSourceTarget;
