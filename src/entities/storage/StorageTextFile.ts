import fs from 'node:fs/promises';
import StorageFile from './StorageFile';
import Profiler from '../../utils/Profiler';

export default class StorageTextFile extends StorageFile<string> {
	protected readonly _extension = 'txt';
	
	public async read(): Promise<string> {
		return Profiler.run(async () => {
			await this.cache();
			const buffer = await fs.readFile(this.localPath);
			return buffer.toString();
		}, `read file "${this.remotePath}"`);
	}

	public async write(contents: string): Promise<void> {
		await this.writeText(contents);
	}
}
