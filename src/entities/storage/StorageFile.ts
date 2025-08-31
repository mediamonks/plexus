import fs from 'node:fs/promises';
import path from 'node:path';
import gcs from '../../services/gcs';
import config from '../../utils/config';
import Debug from '../../utils/Debug';

export default abstract class StorageFile<T> {
	_name: string;
	_type: string;

	abstract readonly _extension: string;

	static TYPE = {
		AGENT_INSTRUCTIONS: 'AGENT_INSTRUCTIONS',
		DIGEST_INSTRUCTIONS: 'DIGEST_INSTRUCTIONS',
		STRUCTURED_DATA: 'STRUCTURED_DATA',
		UNSTRUCTURED_DATA: 'UNSTRUCTURED_DATA',
	} as const
	
	constructor(name: string, type: string) {
		this._name = name;
		this._type = type;
	}
	
	get name() {
		return this._name;
	}
	
	get type() {
		return this._type;
	}
	
	get extension(): string {
		return this._extension;
	}
	
	get fileName() {
		return `${this.name}.${this.extension}`;
	}
	
	get typeBasedPath() {
		return {
			[StorageFile.TYPE.AGENT_INSTRUCTIONS]: 'instructions/agent',
			[StorageFile.TYPE.DIGEST_INSTRUCTIONS]: 'instructions/digest',
			[StorageFile.TYPE.STRUCTURED_DATA]: 'data/structured',
			[StorageFile.TYPE.UNSTRUCTURED_DATA]: 'data/unstructured',
		}[this.type];
	}
	
	get remotePath() {
		return `${this.typeBasedPath}/${this.fileName}`;
	}
	
	get localPath() {
		return path.join(config.get('tempPath') as string, 'storage', ...this.typeBasedPath.split('/'), this.fileName);
	}
	
	get uri() {
		return `gs://${config.get('storage.bucket')}/${this.remotePath}`;
	}
	
	protected async cache(): Promise<void> {
		try {
			await fs.access(this.localPath);
		} catch (error) {
			Debug.log(`Caching storage file "${this.remotePath}"`);
			await gcs.download(this.uri, this.localPath);
		}
	}
	
	abstract read(): Promise<T>;

	abstract write(data: T): Promise<void>;

	protected async writeText(text: string): Promise<void> {
		await Promise.all([
			gcs.write(this.uri, text),
			fs.unlink(this.localPath).catch(),
		]);
	}
}
