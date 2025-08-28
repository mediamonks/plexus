import fs from 'node:fs/promises';
import path from 'node:path';
import gcs from '../../services/gcs';
import config from '../../utils/config';
import Debug from '../../utils/Debug';

class StorageFile {
	_name;
	
	constructor(name: string, type: string) {
		this._name = name;
		this._type = type;
	}
	
	static TYPE = {
		AGENT_INSTRUCTIONS: 'AGENT_INSTRUCTIONS',
		DIGEST_INSTRUCTIONS: 'DIGEST_INSTRUCTIONS',
		STRUCTURED_DATA: 'STRUCTURED_DATA',
		UNSTRUCTURED_DATA: 'UNSTRUCTURED_DATA',
	} as const
	
	get name() {
		return this._name;
	}
	
	get type() {
		return this._type;
	}
	
	get extension() {
		return this.constructor._extension;
	}
	
	get fileName() {
		return `${this.name}.${this.extension}`;
	}
	
	get typeBasedPath() {
		return {
			[this.constructor.TYPE.AGENT_INSTRUCTIONS]: 'instructions/agent',
			[this.constructor.TYPE.DIGEST_INSTRUCTIONS]: 'instructions/digest',
			[this.constructor.TYPE.STRUCTURED_DATA]: 'data/structured',
			[this.constructor.TYPE.UNSTRUCTURED_DATA]: 'data/unstructured',
		}[this.type];
	}
	
	get remotePath() {
		return `${this.typeBasedPath}/${this.fileName}`;
	}
	
	get localPath() {
		return path.join(config.get('tempPath'), 'storage', ...this.typeBasedPath.split('/'), this.fileName);
	}
	
	get uri() {
		return `gs://${config.get('storage.bucket')}/${this.remotePath}`;
	}
	
	async cache(): Promise<void> {
		try {
			await fs.access(this.localPath);
		} catch (error) {
			Debug.log(`Caching storage file "${this.remotePath}"`);
			await gcs.download(this.uri, this.localPath);
		}
	}
	
	async write(contents: string): Promise<void> {
		await Promise.all([
			gcs.write(this.uri, contents),
			fs.unlink(this.localPath).catch(),
		]);
	}
}

export default StorageFile;
