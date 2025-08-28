import DataSourceBehavior from '../DataSourceBehavior';
import DigestDataSourceTarget from '../target/DigestDataSourceTarget';
import FilesDataSourceTarget from '../target/FilesDataSourceTarget';
import RawTextDataSourceTarget from '../target/RawTextDataSourceTarget';
import VectorDataSourceTarget from '../target/VectorDataSourceTarget';
import Storage from '../../storage/Storage';
import StorageFile from '../../storage/StorageFile';
import UnsupportedError from '../../../utils/UnsupportedError';

export default class UnstructuredDataSourceBehavior extends DataSourceBehavior {
	_targetBehavior;
	
	static TARGET = {
		RAW_UNSTRUCTURED: 'raw',
		DIGEST: 'digest',
		VECTOR_UNSTRUCTURED: 'vector',
		FILES: 'files',
	} as const;
	
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
	
	async getIngestedData(): Promise<string> {
		return Storage.get(StorageFile.TYPE.UNSTRUCTURED_DATA, this.dataSource.id).read();
	}
	
	async read(): Promise<any> {
		return this.targetBehavior.read();
	}
	
	async ingest(): Promise<void> {
		return this.targetBehavior.ingest();
	}
	
	async query(parameters: any): Promise<any> {
		return this.targetBehavior.query(parameters);
	}
}
