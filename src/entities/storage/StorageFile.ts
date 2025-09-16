import fs from 'node:fs/promises';
import path from 'node:path';
import gcs from '../../services/gcs';
import config from '../../utils/config';
import Debug from '../../utils/Debug';

export default abstract class StorageFile<T> {
	private readonly _name: string;
	private readonly _type: string;

	protected abstract readonly _extension: string;

	static readonly TYPE = {
		AGENT_INSTRUCTIONS: 'AGENT_INSTRUCTIONS',
		DIGEST_INSTRUCTIONS: 'DIGEST_INSTRUCTIONS',
		STRUCTURED_DATA: 'STRUCTURED_DATA',
		UNSTRUCTURED_DATA: 'UNSTRUCTURED_DATA',
	} as const
	
	protected constructor(name: string, type: string) {
		this._name = name;
		this._type = type;
	}
	
	public get name() {
		return this._name;
	}
	
	public get type() {
		return this._type;
	}
	
	public get extension(): string {
		return this._extension;
	}
	
	public get fileName() {
		return `${this.name}.${this.extension}`;
	}
	
	public get typeBasedPath() {
		return {
			[StorageFile.TYPE.AGENT_INSTRUCTIONS]: 'instructions/agent',
			[StorageFile.TYPE.DIGEST_INSTRUCTIONS]: 'instructions/digest',
			[StorageFile.TYPE.STRUCTURED_DATA]: 'data/structured',
			[StorageFile.TYPE.UNSTRUCTURED_DATA]: 'data/unstructured',
		}[this.type];
	}
	
	public get remotePath() {
		return `${this.typeBasedPath}/${this.fileName}`;
	}
	
	public get localPath() {
		return path.join(config.get('tempPath') as string, 'storage', ...this.typeBasedPath.split('/'), this.fileName);
	}
	
	public get uri() {
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
	
	public abstract read(): Promise<T>;

	public abstract write(data: T): Promise<void>;

	protected async writeText(text: string): Promise<void> {
		await Promise.all([
			gcs.write(this.uri, text),
			fs.unlink(this.localPath).catch(),
		]);
	}
}
