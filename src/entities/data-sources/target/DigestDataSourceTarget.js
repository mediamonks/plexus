const DataSourceBehavior = require('../DataSourceBehavior');
const Storage = require('../../storage/Storage');
const StorageFile = require('../../storage/StorageFile');
const llm = require('../../../modules/llm');

class DigestDataSourceTarget extends DataSourceBehavior {
	async read() {
		const text = this.getContents().join('\n\n');
		
		const systemInstructions = await Storage.get(StorageFile.TYPE.DIGEST_INSTRUCTIONS, this.id).read();
		
		return await llm.query(text, {
			systemInstructions,
			temperature: 0,
		});
	}
	
	async ingest() {
		const contents = await this.read();
		return Storage.get(StorageFile.TYPE.UNSTRUCTURED_DATA, this.id).ingest(contents);
	}
	
	async query() {
		return this.getData();
	}
}

module.exports = DigestDataSourceTarget;
