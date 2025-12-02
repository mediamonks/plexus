import fs from 'node:fs/promises';
import StorageFile from './StorageFile';

export default class StorageTextFile extends StorageFile<string> {
	protected readonly _extension = 'txt';
	
	public async read(): Promise<string> {
		await this.cache();
		const buffer = await fs.readFile(this.localPath);
		return buffer.toString();
	}

	public async write(contents: string): Promise<void> {
		await this.writeText(contents);
	}
};
