import DataSourceBehavior from '../DataSourceBehavior';
import DataSourceItem from '../platform/DataSourceItem';
import DigestDataSourceTarget from '../target/DigestDataSourceTarget';
import FilesDataSourceTarget from '../target/FilesDataSourceTarget';
import ProfileDataSourceTarget from '../target/ProfileDataSourceTarget';
import RawDataDataSourceTarget from '../target/RawDataDataSourceTarget';
import VectorDataSourceTarget from '../target/VectorDataSourceTarget';
import Storage from '../../storage/Storage';
import StorageFile from '../../storage/StorageFile';
import UnsupportedError from '../../../utils/UnsupportedError';
import { JsonObject, JsonPrimitive } from '../../../types/common';

export default class StructuredDataSourceBehavior extends DataSourceBehavior {
	static InputData: typeof DataSourceItem.DataContent;

	static OutputData: typeof DigestDataSourceTarget.OutputData;

	_targetBehavior: RawDataDataSourceTarget | ProfileDataSourceTarget | VectorDataSourceTarget | FilesDataSourceTarget;

	static QueryParameters: {
		input?: string;
		filter?: { [key: string]: JsonPrimitive };
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
