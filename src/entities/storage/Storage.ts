import StorageFile from './StorageFile';
import StorageDataFile from './StorageDataFile';
import StorageTextFile from './StorageTextFile';
import UnsupportedError from '../../utils/UnsupportedError';

export default class Storage {
	static _storageFiles = {};
	
	static get(type: typeof StorageFile.TYPE.STRUCTURED_DATA, name: string): StorageDataFile;
	static get(type: typeof StorageFile.TYPE.DIGEST_INSTRUCTIONS | typeof StorageFile.TYPE.AGENT_INSTRUCTIONS | typeof StorageFile.TYPE.UNSTRUCTURED_DATA, name: string): StorageTextFile;
	static get(type: string, name: string): StorageDataFile | StorageTextFile {
		let instance = Storage._storageFiles[type]?.[name];
		
		if (!instance) {
			const mapping = {
				[StorageFile.TYPE.DIGEST_INSTRUCTIONS]: StorageTextFile,
				[StorageFile.TYPE.AGENT_INSTRUCTIONS]: StorageTextFile,
				[StorageFile.TYPE.STRUCTURED_DATA]: StorageDataFile,
				[StorageFile.TYPE.UNSTRUCTURED_DATA]: StorageTextFile,
			};
			
			const storageFileClass = mapping[type];
			
			if (!storageFileClass) throw new UnsupportedError('storage file type', type, mapping);
		
			instance = new storageFileClass(name, type);
			
			Storage._storageFiles[type] ??= {};
			Storage._storageFiles[type][name] = instance;
		}
		
		return instance;
	}
}
