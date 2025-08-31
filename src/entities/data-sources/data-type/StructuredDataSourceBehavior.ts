import IDataTypeDataSourceBehavior from './IDataTypeDataSourceBehavior';
import DataSourceBehavior from '../DataSourceBehavior';
import DataSourceItem from '../platform/DataSourceItem';
import ITargetDataSourceBehavior from '../target/ITargetDataSourceBehavior';
import DigestTargetDataSourceBehavior from '../target/DigestTargetDataSourceBehavior';
import FilesDataSourceTarget from '../target/FilesTargetDataSourceBehavior';
import ProfileTargetDataSourceBehavior from '../target/ProfileTargetDataSourceBehavior';
import RawDataDataSourceTarget from '../target/RawDataTargetDataSourceBehavior';
import VectorTargetDataSourceBehavior from '../target/VectorTargetDataSourceBehavior';
import Storage from '../../storage/Storage';
import StorageFile from '../../storage/StorageFile';
import UnsupportedError from '../../../utils/UnsupportedError';
import { JsonObject, JsonPrimitive } from '../../../types/common';

export default class StructuredDataSourceBehavior extends DataSourceBehavior implements IDataTypeDataSourceBehavior {
	static InputData: typeof DataSourceItem.DataContent;

	static OutputData: typeof DigestTargetDataSourceBehavior.OutputData;

	_targetBehavior: RawDataDataSourceTarget | ProfileTargetDataSourceBehavior | VectorTargetDataSourceBehavior | FilesDataSourceTarget;

	static QueryParameters: {
		input?: string;
		filter?: { [key: string]: string };
		limit?: number;
		fields?: string[];
		sort?: string
	}

	static TARGET = {
		RAW_STRUCTURED: 'raw',
		PROFILE: 'profile',
		VECTOR_STRUCTURED: 'vector',
		FILES: 'files',
	} as const;
	
	get targetBehavior(): ITargetDataSourceBehavior {
		if (!this._targetBehavior) {
			const mapping = {
				raw: RawDataDataSourceTarget,
				profile: ProfileTargetDataSourceBehavior,
				vector: VectorTargetDataSourceBehavior,
				files: FilesDataSourceTarget,
			};
			
			const targetBehaviorClass = mapping[this.target];
			
			if (!targetBehaviorClass) throw new UnsupportedError('structured data source target', this.target, mapping);
			
			this._targetBehavior = new targetBehaviorClass(this);
		}
		
		return this._targetBehavior;
	}
	
	async getIngestedData(): Promise<AsyncGenerator<JsonObject>> {
		return Storage.get(StorageFile.TYPE.STRUCTURED_DATA, this.dataSource.id).read();
	}
	
	async read(): Promise<any> {
		return this.targetBehavior.read();
	}
	
	async ingest(): Promise<void> {
		return this.targetBehavior.ingest();
	}
	
	async query(parameters: typeof StructuredDataSourceBehavior.QueryParameters): Promise<any> {
		return this.targetBehavior.query(parameters);
	}
}
