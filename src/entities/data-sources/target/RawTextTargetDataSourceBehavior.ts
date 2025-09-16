import ITargetDataSourceBehavior from './ITargetDataSourceBehavior';
import DataSourceBehavior from '../DataSourceBehavior';
import Storage from '../../storage/Storage';
import StorageFile from '../../storage/StorageFile';

export default class RawTextTargetDataSourceBehavior extends DataSourceBehavior implements ITargetDataSourceBehavior {
	static readonly InputData: string[];
	static readonly OutputData: string;
	
	public async read(): Promise<typeof RawTextTargetDataSourceBehavior.OutputData> {
		const contents = await this.getContents() as typeof RawTextTargetDataSourceBehavior.InputData;
		return contents.join('\n\n');
	}
	
	public async ingest(): Promise<void> {
		const contents = await this.read();
		return Storage.get(StorageFile.TYPE.UNSTRUCTURED_DATA, this.id).write(contents);
	}
	
	public async query(): Promise<typeof RawTextTargetDataSourceBehavior.OutputData> {
		// TODO allow searching? throw error?
		return this.getData();
	}
}
