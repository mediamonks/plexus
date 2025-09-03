import IDataTypeDataSourceBehavior from './IDataTypeDataSourceBehavior';
import DataSourceBehavior from '../DataSourceBehavior';
import DataSourceItem from '../platform/DataSourceItem';
import DigestTargetDataSourceBehavior from '../target/DigestTargetDataSourceBehavior';
import FilesDataSourceTarget from '../target/FilesTargetDataSourceBehavior';
import RawTextTargetDataSourceBehavior from '../target/RawTextTargetDataSourceBehavior';
import VectorTargetDataSourceBehavior from '../target/VectorTargetDataSourceBehavior';
import Storage from '../../storage/Storage';
import StorageFile from '../../storage/StorageFile';
import UnsupportedError from '../../../utils/UnsupportedError';

export default class UnstructuredDataSourceBehavior extends DataSourceBehavior implements IDataTypeDataSourceBehavior {
	static InputData: typeof DataSourceItem.TextContent;

	static OutputData: typeof RawTextTargetDataSourceBehavior.OutputData
		| typeof DigestTargetDataSourceBehavior.OutputData
		| typeof VectorTargetDataSourceBehavior.OutputData
		| typeof FilesDataSourceTarget.OutputData;
	
	_targetBehavior;;
	
	static TARGET = {
		RAW_UNSTRUCTURED: 'raw',
		DIGEST: 'digest',
		VECTOR_UNSTRUCTURED: 'vector',
		FILES: 'files',
	} as const;
	
	get targetBehavior() {
		if (!this._targetBehavior) {
			const mapping = {
				raw: RawTextTargetDataSourceBehavior,
				digest: DigestTargetDataSourceBehavior,
				vector: VectorTargetDataSourceBehavior,
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
}
