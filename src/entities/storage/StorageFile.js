const fs = require('node:fs/promises');
const path = require('node:path');
const gcs = require('../../services/gcs');
const config = require('../../utils/config');

class StorageFile {
	_name;
	
	constructor(name) {
		this._name = name;
	}
	
	get name() {
		return this._name;
	}
	
	get extension() {
		return this.constructor._extension;
	}
	
	get fileName() {
		return `${this.name}.${this.extension}`;
	}
	
	get remotePath() {
		return `${this.folder}/${this.fileName}`;
	}
	
	get folder() {
		return this.constructor._folder;
	}
	
	get localPath() {
		return path.join(config.get('tempPath'), 'storage', this.folder, this.fileName);
	}
	
	get uri() {
		return `gs://${config.get('storage.bucket')}/${this.remotePath}`;
	}
	
	async cache() {
		try {
			await fs.access(this.localPath);
		} catch (error) {
			await gcs.download(this.uri, this.localPath);
		}
	}
	
	async write(contents) {
		await Promise.all([
			gcs.write(this.uri, contents),
			fs.unlink(this.localPath).catch(),
		]);
	}
}

module.exports = StorageFile;
