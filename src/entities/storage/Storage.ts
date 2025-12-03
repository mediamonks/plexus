import StorageFile, { StorageFileType } from './StorageFile';
import StorageDataFile from './StorageDataFile';
import StorageTextFile from './StorageTextFile';
import UnsupportedError from '../error-handling/UnsupportedError';
import CloudStorage from '../../services/google-cloud/CloudStorage';
import path from 'node:path';
import Config from '../../core/Config';

type TextFileTypes = typeof StorageFile.TYPE.DIGEST_INSTRUCTIONS | typeof StorageFile.TYPE.AGENT_INSTRUCTIONS | typeof StorageFile.TYPE.UNSTRUCTURED_DATA;

export default class Storage {
	private static readonly _storageFiles = {};
	
	public static get(type: TextFileTypes, name: string): StorageTextFile;
	public static get(type: typeof StorageFile.TYPE.STRUCTURED_DATA, name: string): StorageDataFile;
	public static get(type: StorageFileType, name: string): StorageDataFile | StorageTextFile;
	public static get(type: StorageFileType, name: string): StorageDataFile | StorageTextFile {
		let storageFile = Storage._storageFiles[type]?.[name];
		
		if (!storageFile) {
			const mapping = {
				[StorageFile.TYPE.DIGEST_INSTRUCTIONS]: StorageTextFile,
				[StorageFile.TYPE.AGENT_INSTRUCTIONS]: StorageTextFile,
				[StorageFile.TYPE.STRUCTURED_DATA]: StorageDataFile,
				[StorageFile.TYPE.UNSTRUCTURED_DATA]: StorageTextFile,
			};
			
			const storageFileClass = mapping[type];
			
			if (!storageFileClass) throw new UnsupportedError('storage file type', type, Object.keys(mapping));
		
			storageFile = new storageFileClass(name, type);
			
			Storage._storageFiles[type] ??= {};
			Storage._storageFiles[type][name] = storageFile;
		}
		
		return storageFile;
	}
	
	public static async save(namespace: string, localPath: string): Promise<void> {
		const uri = `gs://${Config.get('storage.bucket')}/files/${namespace}/${path.basename(localPath)}`;
		await CloudStorage.upload(localPath, uri);
	}
	
	public static async getFiles(namespace: string): Promise<string[]> {
		const cachePath = `gs://${Config.get('storage.bucket')}/files/${namespace}`;
		return CloudStorage.list(cachePath);
	}
};
