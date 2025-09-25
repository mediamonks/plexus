import IDataTypeDataSourceBehavior from './IDataTypeDataSourceBehavior';
import DataSourceBehavior from '../DataSourceBehavior';
import ITargetDataSourceBehavior from '../target/ITargetDataSourceBehavior';
import ProfileTargetDataSourceBehavior from '../target/ProfileTargetDataSourceBehavior';
import RawDataDataSourceTarget from '../target/RawDataTargetDataSourceBehavior';
import VectorTargetDataSourceBehavior from '../target/VectorTargetDataSourceBehavior';
import Storage from '../../storage/Storage';
import StorageFile from '../../storage/StorageFile';
import UnsupportedError from '../../error-handling/UnsupportedError';
import { JsonObject } from '../../../types/common';

export default class StructuredDataSourceBehavior extends DataSourceBehavior implements IDataTypeDataSourceBehavior {
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
	} as const;
	
	readonly fileType = StorageFile.TYPE.STRUCTURED_DATA;
	
	public get targetBehaviorClass(): new () => ITargetDataSourceBehavior {
		const mapping = {
			raw: RawDataDataSourceTarget,
			profile: ProfileTargetDataSourceBehavior,
			vector: VectorTargetDataSourceBehavior,
		};
		
		const targetBehaviorClass = mapping[this.dataSource.target];
		
		if (!targetBehaviorClass) throw new UnsupportedError('structured data source target', this.dataSource.target, Object.keys(mapping));
		
		return targetBehaviorClass;
	}
	
	public async ingest(): Promise<void> {
		const data = await this.dataSource.read() as AsyncGenerator<JsonObject>;
		return Storage.get(StorageFile.TYPE.STRUCTURED_DATA, this.dataSource.id).write(data);
	}
	
	public async getIngestedData(): Promise<AsyncGenerator<JsonObject>> {
		return Storage.get(StorageFile.TYPE.STRUCTURED_DATA, this.dataSource.id).read();
	}
}
