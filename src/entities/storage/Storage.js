const StorageFile = require('./StorageFile');
const StorageDataFile = require('./StorageDataFile');
const StorageTextFile = require('./StorageTextFile');
const UnsupportedError = require('../../utils/UnsupportedError');

class Storage {
	static _storageFiles = {};
	
	static get(type, name) {
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

module.exports = Storage;
