import DataSource from '../DataSource';
import Storage from '../../storage/Storage';
import StorageFile from '../../storage/StorageFile';
import UnsupportedError from '../../error-handling/UnsupportedError';
import CustomError from '../../error-handling/CustomError';

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
	
	public async getToolCallSchema(): Promise<never> {
		throw new CustomError('Not implemented');
	}
	
	public async toolCall(): Promise<never> {
		throw new CustomError('Not implemented');
	}
};
