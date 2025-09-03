import fs from 'node:fs/promises';
import path from 'node:path';
import DataSourceItem from './DataSourceItem';
import gcs from '../../../services/gcs';
import jsonl from '../../../utils/jsonl';
import pdf from '../../../utils/pdf';
import UnsupportedError from '../../../utils/UnsupportedError';
import { JsonObject, ValueOf } from '../../../types/common';

export default class GcsDataSourceItem extends DataSourceItem {
	static TextContent: string;

	static DataContent: AsyncGenerator<JsonObject>;

	_uri: string;;;;
	
	constructor(dataSource: any, uri: string) {
		super(dataSource);

		this._uri = uri;
	}
	
	get uri(): string {
		return this._uri;
	}
	
	get extension(): string {
		return path.extname(this.uri).substring(1);
	}
	
	get fileName(): string {
		return path.basename(this.uri);
	}
	
	detectDataType(): ValueOf<typeof DataSourceItem.DATA_TYPE> {
		return {
			pdf: DataSourceItem.DATA_TYPE.UNSTRUCTURED,
			txt: DataSourceItem.DATA_TYPE.UNSTRUCTURED,
			jsonl: DataSourceItem.DATA_TYPE.STRUCTURED,
		}[this.extension];
	}
	
	async getLocalFile(): Promise<string> {
		return this.allowCache ? await gcs.cache(this.uri) : gcs.download(this.uri);
	}
	
	async toText(): Promise<typeof GcsDataSourceItem.TextContent> {
		const file = await this.getLocalFile();
		
		const mapping = {
			pdf: () => pdf.getPdfText(file),
			txt: async () => (await fs.readFile(file)).toString()
		};
		
		if (!mapping[this.extension]) throw new UnsupportedError('file type', this.extension, mapping);
		
		return await mapping[this.extension]();
	}
	
	async toData(): Promise<typeof GcsDataSourceItem.DataContent> {
		const file = await this.getLocalFile();
		return jsonl.read(file);
	}
}
