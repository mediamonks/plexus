const DataSourceBehavior = require('../DataSourceBehavior');
const DigestDataSourceTarget = require('../target/DigestDataSourceTarget');
const FilesDataSourceTarget = require('../target/FilesDataSourceTarget');
const RawTextDataSourceTarget = require('../target/RawTextDataSourceTarget');
const VectorDataSourceTarget = require('../target/VectorDataSourceTarget');
const { default: Storage, STORAGE_FILE_DATA_TYPE } = require('../../storage/Storage');
const UnsupportedError = require('../../../utils/UnsupportedError');

class UnstructuredDataSourceBehavior extends DataSourceBehavior {
	_targetBehavior;
	
	get targetBehavior() {
		if (!this._targetBehavior) {
			const mapping = {
				raw: RawTextDataSourceTarget,
				digest: DigestDataSourceTarget,
				vector: VectorDataSourceTarget,
				files: FilesDataSourceTarget,
			};
			
			const targetBehaviorClass = mapping[this.target];
			
			if (!targetBehaviorClass) throw new UnsupportedError('unstructured data source target', this.target, mapping);
			
			this._targetBehavior = new targetBehaviorClass(this);
		}
		
		return this._targetBehavior;
	}
	
	async getCachedData() {
		return Storage.get(STORAGE_FILE_DATA_TYPE.TEXT, this.dataSource.id).read();
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

module.exports = UnstructuredDataSourceBehavior;
