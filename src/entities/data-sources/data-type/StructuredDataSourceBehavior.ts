import IDataTypeDataSourceBehavior from './IDataTypeDataSourceBehavior';
import DataSourceBehavior from '../DataSourceBehavior';
import DataSourceItem from '../platform/DataSourceItem';
import ITargetDataSourceBehavior from '../target/ITargetDataSourceBehavior';
import FilesDataSourceTarget from '../target/FileTargetDataSourceBehavior';
import ProfileTargetDataSourceBehavior from '../target/ProfileTargetDataSourceBehavior';
import RawDataDataSourceTarget from '../target/RawDataTargetDataSourceBehavior';
import VectorTargetDataSourceBehavior from '../target/VectorTargetDataSourceBehavior';
import Storage from '../../storage/Storage';
import StorageFile from '../../storage/StorageFile';
import ErrorLog from '../../../utils/ErrorLog';
import UnsupportedError from '../../../utils/UnsupportedError';
import { JsonObject } from '../../../types/common';

export default class StructuredDataSourceBehavior extends DataSourceBehavior implements IDataTypeDataSourceBehavior {
	static readonly InputData: typeof DataSourceItem.DataContent;

	static readonly OutputData: typeof RawDataDataSourceTarget.OutputData
		| typeof ProfileTargetDataSourceBehavior.OutputData
		| typeof VectorTargetDataSourceBehavior.OutputData
		| typeof FilesDataSourceTarget.OutputData;

	private _targetBehavior: RawDataDataSourceTarget | ProfileTargetDataSourceBehavior | VectorTargetDataSourceBehavior | FilesDataSourceTarget;

	static readonly QueryParameters: {
		input?: string;
		filter?: { [key: string]: string };
		limit?: number;
		fields?: string[];
		sort?: string;
	};

	static readonly TARGET = {
		RAW_STRUCTURED: 'raw',
		PROFILE: 'profile',
		VECTOR_STRUCTURED: 'vector',
		FILES: 'files', // TODO for backwards compatibility
		FILE: 'file',
	} as const;
	
	public get targetBehavior(): ITargetDataSourceBehavior {
		if (!this._targetBehavior) {
			const mapping = {
				raw: RawDataDataSourceTarget,
				profile: ProfileTargetDataSourceBehavior,
				vector: VectorTargetDataSourceBehavior,
				files: FilesDataSourceTarget, // TODO for backwards compatibility
				file: FilesDataSourceTarget,
			};
			
			const targetBehaviorClass = mapping[this.target];
			
			if (!targetBehaviorClass) ErrorLog.throw(new UnsupportedError('structured data source target', this.target, mapping));
			
			this._targetBehavior = new targetBehaviorClass(this);
		}
		
		return this._targetBehavior;
	}
	
	public async getIngestedData(): Promise<AsyncGenerator<JsonObject>> {
		return Storage.get(StorageFile.TYPE.STRUCTURED_DATA, this.dataSource.id).read();
	}
}
