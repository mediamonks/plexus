import DataSourceBehavior from '../DataSourceBehavior';
import Storage from '../../storage/Storage';
import StorageFile from '../../storage/StorageFile';
import llm from '../../../modules/llm';

class DigestDataSourceTarget extends DataSourceBehavior {
	static DataType: string;

	async read(): Promise<typeof DigestDataSourceTarget.DataType> {
		const text = this.getContents().join('\n\n');
		
		const systemInstructions = await Storage.get(StorageFile.TYPE.DIGEST_INSTRUCTIONS, this.id).read();
		
		return await llm.query(text, {
			systemInstructions,
			temperature: 0,
		});
	}
	
	async ingest(): Promise<void> {
		const contents = await this.read();
		return Storage.get(StorageFile.TYPE.UNSTRUCTURED_DATA, this.id).ingest(contents);
	}
	
	async query(): Promise<any> {
		return this.getData();
	}
}

export default DigestDataSourceTarget;
