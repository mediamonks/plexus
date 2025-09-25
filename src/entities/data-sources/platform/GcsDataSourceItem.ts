import fs from 'node:fs/promises';
import path from 'node:path';
import DataSourceItem from './DataSourceItem';
import DataSource from '../DataSource';
import gcs from '../../../services/gcs';
import jsonl from '../../../utils/jsonl';
import pdf from '../../../utils/pdf';
import UnsupportedError from '../../error-handling/UnsupportedError';
import { JsonField, JsonObject, ValueOf } from '../../../types/common';

export default class GcsDataSourceItem extends DataSourceItem {
	static readonly TextContent: string;
	static readonly DataContent: AsyncGenerator<JsonObject>;

	private readonly _uri: string;
	
	public constructor(dataSource: DataSource, uri: string) {
		super(dataSource);

		this._uri = uri;
	}
	
	public get uri(): string {
		return this._uri;
	}
	
	public get extension(): string {
		return path.extname(this.uri).substring(1);
	}
	
	public get fileName(): string {
		return path.basename(this.uri);
	}
	
	protected detectDataType(): ValueOf<typeof DataSourceItem.DATA_TYPE> {
		return {
			pdf: DataSourceItem.DATA_TYPE.UNSTRUCTURED,
			txt: DataSourceItem.DATA_TYPE.UNSTRUCTURED,
			jsonl: DataSourceItem.DATA_TYPE.STRUCTURED,
		}[this.extension];
	}
	
	public async getLocalFile(): Promise<string> {
		return this.allowCache ? await gcs.cache(this.uri) : gcs.download(this.uri);
	}
	
	public async toText(): Promise<typeof GcsDataSourceItem.TextContent> {
		const file = await this.getLocalFile();
		
		const mapping = {
			pdf: () => pdf.getPdfText(file),
			txt: async () => (await fs.readFile(file)).toString()
		};
		
		if (!mapping[this.extension]) throw new UnsupportedError('file type', this.extension, Object.keys(mapping));
		
		return await mapping[this.extension]();
	}
	
	public async toData(): Promise<typeof GcsDataSourceItem.DataContent> {
		const file = await this.getLocalFile();
		return jsonl.read(file);
	}
	
	public toJSON(): JsonField {
		return this.uri;
	}
}
