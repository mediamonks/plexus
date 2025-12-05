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
import { JsonObject, ValueOf } from '../../../types/common';

export default class GoogleCloudStorageDataSourceItem extends DataSourceItem<string, AsyncGenerator<JsonObject>> {
	public constructor(
		dataSource: DataSource,
		private readonly _uri: string,
		private readonly _name?: string,
	)	{
		super(dataSource);
	}
	
	private _size?: Promise<number>;
	
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
		return this._name ?? path.basename(this.uri);
	}
	
	public get mimeType(): string {
		const mimeType = mimeTypes.lookup(this.uri);
		if (!mimeType) throw new CustomError(`Failed detecting mime type for file "${this.uri}"`);
		return mimeType;
	}
	
	// TODO code smell?
	public get size(): Promise<number> {
		return this._size ??= CloudStorage.getSize(this.uri);
	}
	
	public async getLocalFile(): Promise<string> {
		const localPath = this.allowCache ? await CloudStorage.cache(this.uri) : await CloudStorage.download(this.uri);
		
		if (LLM.supportedMimeTypes.has(this.mimeType)) return localPath;
		
		return await GoogleDrive.convertToPdf(localPath);
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
	
	public toValue(): string {
		return this.uri;
	}
	
	public async getTextContent(): Promise<string> {
		const content = await CloudStorage.getContent(this.uri);
		return content.toString('utf8');
	}
	
	public async toBase64(): Promise<string> {
		const content = await CloudStorage.getContent(this.uri);
		return content.toString('base64');
	}
	
	private detectDataType(): ValueOf<typeof DataSource.DATA_TYPE> {
		return {
			pdf: DataSource.DATA_TYPE.UNSTRUCTURED,
			txt: DataSource.DATA_TYPE.UNSTRUCTURED,
			jsonl: DataSource.DATA_TYPE.STRUCTURED,
		}[this.extension];
	}
}
