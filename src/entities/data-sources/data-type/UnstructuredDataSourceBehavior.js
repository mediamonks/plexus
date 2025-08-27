const DataSourceBehavior = require('../DataSourceBehavior');
const DigestDataSourceTarget = require('../target/DigestDataSourceTarget');
const FilesDataSourceTarget = require('../target/FilesDataSourceTarget');
const RawTextDataSourceTarget = require('../target/RawTextDataSourceTarget');
const VectorDataSourceTarget = require('../target/VectorDataSourceTarget');
const Storage = require('../../storage/Storage');
const StorageFile = require('../../storage/StorageFile');
const UnsupportedError = require('../../../utils/UnsupportedError');

class UnstructuredDataSourceBehavior extends DataSourceBehavior {
	_targetBehavior;
	
	static TARGET = {
		RAW_UNSTRUCTURED: 'raw',
		DIGEST: 'digest',
		VECTOR_UNSTRUCTURED: 'vector',
		FILES: 'files',
	};
	
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
	
	async getIngestedData() {
		return Storage.get(StorageFile.TYPE.UNSTRUCTURED_DATA, this.dataSource.id).read();
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
