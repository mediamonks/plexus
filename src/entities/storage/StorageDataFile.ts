import StorageFile from './StorageFile';
import jsonl from '../../utils/jsonl';
import { JsonObject } from '../../types/common';

export default class StorageDataFile extends StorageFile<AsyncGenerator<JsonObject>> {
	readonly _extension = 'jsonl';
	
	async read(): Promise<AsyncGenerator<JsonObject>> {
		await this.cache();
		return jsonl.read(this.localPath);
	}

	async write(reader: AsyncGenerator<JsonObject>): Promise<void> {
		const contents = [];
		for await (const item of reader) contents.push(item);
		await this.writeText(contents.map(item => JSON.stringify(item)).join('\n'));
	}
}
