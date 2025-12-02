import fs from 'node:fs/promises';
import path from 'node:path';
import CloudStorage from '../../services/google-cloud/CloudStorage';
import Config from '../../core/Config';
import Debug from '../../core/Debug';

export default abstract class StorageFile<TContent> {
	private readonly _name: string;
	private readonly _type: string;

	protected abstract readonly _extension: string;
	
	public static readonly TYPE = {
		AGENT_INSTRUCTIONS: 'AGENT_INSTRUCTIONS',
		DIGEST_INSTRUCTIONS: 'DIGEST_INSTRUCTIONS',
		STRUCTURED_DATA: 'STRUCTURED_DATA',
		UNSTRUCTURED_DATA: 'UNSTRUCTURED_DATA',
	} as const;
	
	constructor(name: string, type: StorageFileType) {
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
		return path.join(Config.get('tempPath') as string, 'storage', ...this.typeBasedPath.split('/'), this.fileName);
	}
	
	public get uri() {
		return `gs://${Config.get('storage.bucket')}/${this.remotePath}`;
	}
	
	protected async cache(): Promise<void> {
		try {
			await fs.access(this.localPath);
		} catch (error) {
			Debug.log(`Caching storage file "${this.remotePath}"`, 'FS');
			await CloudStorage.download(this.uri, this.localPath);
		}
	}
	
	public abstract read(): Promise<TContent>;

	public abstract write(data: TContent): Promise<void>;

	protected async writeText(text: string): Promise<void> {
		await Promise.all([
			CloudStorage.write(this.uri, text),
			fs.unlink(this.localPath).catch(() => {}),
		]);
	}
};

export type StorageFileType = typeof StorageFile.TYPE[keyof typeof StorageFile.TYPE];
