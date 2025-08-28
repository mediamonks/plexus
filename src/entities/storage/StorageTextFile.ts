import fs from 'node:fs/promises';
import StorageFile from './StorageFile';

class StorageTextFile extends StorageFile {
	static _extension = 'txt'
	
	async read(): Promise<string> {
		await this.cache();
		const buffer = await fs.readFile(this.localPath);
		return buffer.toString();
	}
}

export default StorageTextFile;
