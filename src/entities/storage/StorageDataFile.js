const StorageFile = require('./StorageFile');
const jsonl = require('../../utils/jsonl');

class StorageDataFile extends StorageFile {
	static _folder = 'data';
	static _extension = 'jsonl'
	
	async read() {
		await this.cache();
		return jsonl.read(this.localPath);
	}
}

module.exports = StorageDataFile;
