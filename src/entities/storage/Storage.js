const DataStorageFile = require('./StorageDataFile');
const TextStorageFile = require('./StorageTextFile');
const UnsupportedError = require('../../utils/UnsupportedError');

const STORAGE_FILE_DATA_TYPE = {
	TEXT: 'text',
	DATA: 'data',
};

class Storage {
	static _storageFiles = {};
	
	static get(dataType, name) {
		let instance = Storage._storageFiles[dataType]?.[name];
		
		if (!instance) {
			const mapping = {
				[STORAGE_FILE_DATA_TYPE.TEXT]: TextStorageFile,
				[STORAGE_FILE_DATA_TYPE.DATA]: DataStorageFile,
			};
			
			const storageFileClass = mapping[dataType];
			
			if (!storageFileClass) throw new UnsupportedError('storage file data type', dataType, mapping);
			
			instance = new storageFileClass();
			
			Storage._storageFiles[dataType] ??= {};
			Storage._storageFiles[dataType][name] = instance;
		}
		
		return instance;
	}
}

module.exports = {
	default: Storage,
	STORAGE_FILE_DATA_TYPE,
};
