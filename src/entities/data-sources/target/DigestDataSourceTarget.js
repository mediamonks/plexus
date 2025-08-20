const DataSourceBehavior = require('../DataSourceBehavior');
const { default: Storage, STORAGE_FILE_DATA_TYPE } = require('../../storage/Storage');
const llm = require('../../../modules/llm');

class DigestDataSourceTarget extends DataSourceBehavior {
	async read() {
		const text = this.getContents().join('\n\n');
		
		const systemInstructions = await Storage.get(STORAGE_FILE_DATA_TYPE.TEXT, `system-instructions/${this.id}-digest`).read();
		
		return await llm.query(text, {
			systemInstructions,
			temperature: 0,
		});
	}
	
	async ingest() {
		const contents = await this.read();
		return Storage.get(STORAGE_FILE_DATA_TYPE.TEXT, this.id).ingest(contents);
	}
	
	async query() {
		return this.getData();
	}
}

module.exports = DigestDataSourceTarget;
