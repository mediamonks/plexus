import DataSource from '../DataSource';
import Storage from '../../storage/Storage';
import StorageFile from '../../storage/StorageFile';

export default class RawTextTargetDataSource extends DataSource {
	public async ingest(): Promise<void> {
		const data = await this.origin.getText();
		
		await Storage.get(StorageFile.TYPE.UNSTRUCTURED_DATA, this.id).write(data);
	}
	
	public async query(): Promise<string> {
		try {
			return await Storage.get(StorageFile.TYPE.UNSTRUCTURED_DATA, this.id).read();
		} catch (error) {
			return await this.origin.getText();
		}
	}
};
