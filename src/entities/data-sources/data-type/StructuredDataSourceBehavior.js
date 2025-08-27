const DataSourceBehavior = require('../DataSourceBehavior');
const FilesDataSourceTarget = require('../target/FilesDataSourceTarget');
const ProfileDataSourceTarget = require('../target/ProfileDataSourceTarget');
const RawDataDataSourceTarget = require('../target/RawDataDataSourceTarget');
const VectorDataSourceTarget = require('../target/VectorDataSourceTarget');
const Storage = require('../../storage/Storage');
const StorageFile = require('../../storage/StorageFile');
const UnsupportedError = require('../../../utils/UnsupportedError');

class StructuredDataSourceBehavior extends DataSourceBehavior {
	_targetBehavior;
	
	static TARGET = {
		RAW_STRUCTURED: 'raw',
		PROFILE: 'profile',
		VECTOR_STRUCTURED: 'vector',
		FILES: 'files',
	};
	
	get targetBehavior() {
		if (!this._targetBehavior) {
			const mapping = {
				raw: RawDataDataSourceTarget,
				profile: ProfileDataSourceTarget,
				vector: VectorDataSourceTarget,
				files: FilesDataSourceTarget,
			};
			
			const targetBehaviorClass = mapping[this.target];
			
			if (!targetBehaviorClass) throw new UnsupportedError('structured data source target', this.target, mapping);
			
			this._targetBehavior = new targetBehaviorClass(this);
		}
		
		return this._targetBehavior;
	}
	
	async getIngestedData() {
		return Storage.get(StorageFile.TYPE.STRUCTURED_DATA, this.dataSource.id).read();
	}
	
	async read() {
		return this.targetBehavior.read();
	}
	
	async ingest() {
		return this.targetBehavior.ingest();
	}
	
	async query(parameters) {
		return this.targetBehavior.query(parameters);
	}
}

module.exports = StructuredDataSourceBehavior;
