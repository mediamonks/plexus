const fs = require('node:fs/promises');
const StorageFile = require('./StorageFile');

class StorageTextFile extends StorageFile {
	static _extension = 'txt'
	
	async read() {
		await this.cache();
		const buffer = await fs.readFile(this.localPath);
		return buffer.toString();
	}
}

module.exports = StorageTextFile;
