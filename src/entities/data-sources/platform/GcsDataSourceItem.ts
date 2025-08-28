import fs from 'node:fs/promises';
import path from 'node:path';
import DataSourceItem from './DataSourceItem';
import gcs from '../../../services/gcs';
import jsonl from '../../../utils/jsonl';
import pdf from '../../../utils/pdf';
import UnsupportedError from '../../../utils/UnsupportedError';
import { JsonObject } from '../../../types/common';

class GcsDataSourceItem extends DataSourceItem {
	_uri;
	
	constructor(dataSource: any, uri: string) {
		super(dataSource);
		this._uri = uri;
	}
	
	get uri() {
		return this._uri;
	}
	
	get extension() {
		return path.extname(this.uri).substring(1);
	}
	
	get fileName() {
		return path.basename(this.uri);
	}
	
	detectDataType(): string {
		return {
			pdf: 'text',
			txt: 'text',
			jsonl: 'data',
		}[this.extension];
	}
	
	async getLocalFile(): Promise<string> {
		return this.allowCache ? await gcs.cache(this.uri) : gcs.download(this.uri);
	}
	
	async toText(): Promise<string> {
		const file = await this.getLocalFile();
		
		const mapping = {
			pdf: () => pdf.getPdfText(file),
			txt: async () => (await fs.readFile(file)).toString()
		};
		
		if (!mapping[this.extension]) throw new UnsupportedError('file type', this.extension, mapping);
		
		return await mapping[this.extension]();
	}
	
	async toData(): Promise<AsyncGenerator<JsonObject>> {
		const file = await this.getLocalFile();
		return jsonl.read(file);
	}
}

export default GcsDataSourceItem;
