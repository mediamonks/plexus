import TargetDataSourceBehavior from './TargetDataSourceBehavior';
import Storage from '../../storage/Storage';
import StorageFile from '../../storage/StorageFile';
import llm from '../../../modules/llm';

export default class DigestTargetDataSourceBehavior extends TargetDataSourceBehavior {
	async read(): Promise<string> {
		const contents = await this.dataSource.getContents();
		
		const text = contents.join('\n\n');
		
		const systemInstructions = await Storage.get(StorageFile.TYPE.DIGEST_INSTRUCTIONS, this.dataSource.id).read();
		
		return await llm.query(text, {
			systemInstructions,
			temperature: 0,
		});
	}
}
