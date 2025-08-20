const DataSourceBehavior = require('../DataSourceBehavior');
const FilesDataSourceTarget = require('../target/FilesDataSourceTarget');
const ProfileDataSourceTarget = require('../target/ProfileDataSourceTarget');
const RawDataDataSourceTarget = require('../target/RawDataDataSourceTarget');
const VectorDataSourceTarget = require('../target/VectorDataSourceTarget');
const { default: Storage, STORAGE_FILE_DATA_TYPE } = require('../../storage/Storage');
const UnsupportedError = require('../../../utils/UnsupportedError');

class StructuredDataSourceBehavior extends DataSourceBehavior {
	_targetBehavior;

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
	
	async getCachedData() {
		return Storage.get(STORAGE_FILE_DATA_TYPE.DATA, this.dataSource.id).read();
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
