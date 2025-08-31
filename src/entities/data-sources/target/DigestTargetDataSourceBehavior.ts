import DataSourceBehavior from '../DataSourceBehavior';
import Storage from '../../storage/Storage';
import StorageFile from '../../storage/StorageFile';
import llm from '../../../modules/llm';

export default class DigestTargetDataSourceBehavior extends DataSourceBehavior {
	static InputData: string[];
	static OutputData: string;

	async read(): Promise<typeof DigestTargetDataSourceBehavior.OutputData> {
		const contents = await this.getContents();
		
		const text = contents.join('\n\n');
		
		const systemInstructions = await Storage.get(StorageFile.TYPE.DIGEST_INSTRUCTIONS, this.id).read();
		
		return await llm.query(text, {
			systemInstructions,
			temperature: 0,
		});
	}
	
	async ingest(): Promise<void> {
		const contents = await this.read();

		return Storage.get(StorageFile.TYPE.UNSTRUCTURED_DATA, this.id).write(contents);
	}
	
	async query(): Promise<typeof DigestTargetDataSourceBehavior.OutputData> {
		return this.getData();
	}
}
