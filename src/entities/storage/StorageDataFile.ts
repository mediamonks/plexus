import StorageFile from './StorageFile';
import jsonl from '../../utils/jsonl';

class StorageDataFile extends StorageFile {
	static _extension = 'jsonl'
	
	async read(): Promise<AsyncGenerator<any>> {
		await this.cache();
		return jsonl.read(this.localPath);
	}
}

export default StorageDataFile;
