import IDataTypeDataSourceBehavior from './IDataTypeDataSourceBehavior';
import DataSourceBehavior from '../DataSourceBehavior';
import ITargetDataSourceBehavior from '../target/ITargetDataSourceBehavior';
import DigestTargetDataSourceBehavior from '../target/DigestTargetDataSourceBehavior';
import RawTextTargetDataSourceBehavior from '../target/RawTextTargetDataSourceBehavior';
import VectorTargetDataSourceBehavior from '../target/VectorTargetDataSourceBehavior';
import Storage from '../../storage/Storage';
import StorageFile from '../../storage/StorageFile';
import UnsupportedError from '../../error-handling/UnsupportedError';

export default class UnstructuredDataSourceBehavior extends DataSourceBehavior implements IDataTypeDataSourceBehavior {
	static readonly TARGET = {
		RAW_UNSTRUCTURED: 'raw',
		DIGEST: 'digest',
		VECTOR_UNSTRUCTURED: 'vector',
	} as const;
	
	public get targetBehaviorClass(): new () => ITargetDataSourceBehavior {
		const mapping = {
			raw: RawTextTargetDataSourceBehavior,
			vector: VectorTargetDataSourceBehavior,
			digest: DigestTargetDataSourceBehavior,
		};
		
		const targetBehaviorClass = mapping[this.dataSource.target];
		
		if (!targetBehaviorClass) throw new UnsupportedError('unstructured data source target', this.dataSource.target, Object.keys(mapping));
		
		return targetBehaviorClass;
	}
	
	public async ingest(): Promise<void> {
		const data = await this.dataSource.read() as string;
		return Storage.get(StorageFile.TYPE.UNSTRUCTURED_DATA, this.dataSource.id).write(data);
	}
	
	public async getIngestedData(): Promise<string> {
		return Storage.get(StorageFile.TYPE.UNSTRUCTURED_DATA, this.dataSource.id).read();
	}
}
