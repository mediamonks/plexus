import StorageFile, { StorageFileType } from './StorageFile';
import StorageDataFile from './StorageDataFile';
import StorageTextFile from './StorageTextFile';
import UnsupportedError from '../error-handling/UnsupportedError';

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
}
