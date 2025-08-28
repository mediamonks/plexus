import DataSourceBehavior from '../DataSourceBehavior';
import Storage from '../../storage/Storage';
import StorageFile from '../../storage/StorageFile';

class RawTextDataSourceTarget extends DataSourceBehavior {
	async read(): Promise<string> {
		return this.getContents().join('\n\n');
	}
	
	async ingest(): Promise<void> {
		const contents = await this.read();
		return Storage.get(StorageFile.TYPE.UNSTRUCTURED_DATA, this.id).ingest(contents);
	}
	
	async query(): Promise<any> {
		return this.getData();
	}
}

export default RawTextDataSourceTarget;
