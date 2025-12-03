import fs from 'node:fs/promises';
import path from 'node:path';
import mimeTypes from 'mime-types';
import DataSourceItem from './DataSourceItem';
import DataSource from '../DataSource';
import CustomError from '../../error-handling/CustomError';
import UnsupportedError from '../../error-handling/UnsupportedError';
import CloudStorage from '../../../services/google-cloud/CloudStorage';
import GoogleDrive from '../../../services/google-drive/GoogleDrive';
import LLM from '../../../services/llm/LLM';
import hash from '../../../utils/hash';
import jsonl from '../../../utils/jsonl';
import pdf from '../../../utils/pdf';
import { JsonField, JsonObject, ValueOf } from '../../../types/common';

export default class GoogleCloudStorageDataSourceItem extends DataSourceItem<string, AsyncGenerator<JsonObject>> {
	private readonly _uri: string;
	
	public constructor(dataSource: DataSource, uri: string) {
		super(dataSource);

		this._uri = uri;
	}
	
	public get uri(): string {
		return this._uri;
	}
	
	public get id(): string {
		return hash(this.uri);
	}
	
	public get extension(): string {
		return path.extname(this.uri).substring(1);
	}
	
	public get fileName(): string {
		return path.basename(this.uri);
	}
	
	private get mimeType(): string {
		const mimeType = mimeTypes.lookup(this.uri);
		if (!mimeType) throw new CustomError(`Failed detecting mime type for file "${this.uri}"`);
		return mimeType;
	}
	
	public async getLocalFile(): Promise<string> {
		const localPath = this.allowCache ? await CloudStorage.cache(this.uri) : await CloudStorage.download(this.uri);
		
		if (LLM.supportedMimeTypes.includes(this.mimeType)) return localPath;
		
		return await GoogleDrive.convertToPdf(localPath, this.allowCache);
	}
	
	public async toText(): Promise<string> {
		const file = await this.getLocalFile();
		
		const mapping = {
			pdf: () => pdf.getPdfText(file),
			txt: async () => (await fs.readFile(file)).toString()
		};
		
		if (!mapping[this.extension]) throw new UnsupportedError('file type', this.extension, Object.keys(mapping));
		
		return await mapping[this.extension]();
	}
	
	public async toData(): Promise<AsyncGenerator<JsonObject>> {
		const file = await this.getLocalFile();
		return jsonl.read(file);
	}
	
	public toJSON(): JsonField {
		return this.uri;
	}
	
	private detectDataType(): ValueOf<typeof DataSource.DATA_TYPE> {
		return {
			pdf: DataSource.DATA_TYPE.UNSTRUCTURED,
			txt: DataSource.DATA_TYPE.UNSTRUCTURED,
			jsonl: DataSource.DATA_TYPE.STRUCTURED,
		}[this.extension];
	}
}
