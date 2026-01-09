import fs from 'node:fs/promises';
import DataSourceItem from './DataSourceItem';
import DataSource from '../DataSource';
import UnsupportedError from '../../error-handling/UnsupportedError';
import GoogleDocs from '../../../services/google-drive/GoogleDocs';
import GoogleDrive, { Metadata } from '../../../services/google-drive/GoogleDrive';
import LLM from '../../../services/llm/LLM';
import GoogleSheets from '../../../services/google-drive/GoogleSheets';
import pdf from '../../../utils/pdf';
import xlsx from '../../../utils/xlsx';
import { JsonField, SpreadSheetData, ValueOf } from '../../../types/common';

export default class GoogleDriveDataSourceItem extends DataSourceItem<string, SpreadSheetData> {
	static readonly TextContent: string;
	static readonly DataContent: SpreadSheetData;
	static readonly Content: typeof GoogleDriveDataSourceItem.TextContent | typeof GoogleDriveDataSourceItem.DataContent;
	
	private readonly _metadata: Metadata;

	public constructor(dataSource: DataSource, metadata: Metadata) {
		super(dataSource);
		this._metadata = metadata;
	}
	
	public get metadata(): Metadata {
		return this._metadata;
	}
	
	public get id(): string {
		return this.metadata.id;
	}
	
	public get mimeType(): string {
		return this.metadata.mimeType;
	}
	
	public get fileName(): string {
		return this.metadata.name;
	}
	
	public getLocalFile(): Promise<string> {
		return this.allowCache ? GoogleDrive.cache(this.metadata) : GoogleDrive.download(this.metadata);
	}
	
	public async toText(): Promise<typeof GoogleDriveDataSourceItem.TextContent> {
		if (this.mimeType === 'application/vnd.google-apps.document') {
			return await GoogleDocs.getMarkdown(this.id);
		}
		
		const file = (await this.getLocalFile()) as string;
		
		if (this.mimeType === 'application/pdf') return await pdf.getPdfText(file);
		
		if (this.mimeType === 'text/plain') {
			const buffer = await fs.readFile(file);
			return buffer.toString();
		}
		
		throw new UnsupportedError('mime type for text extraction', this.mimeType);
	}
	
	public async toData(): Promise<typeof GoogleDriveDataSourceItem.DataContent> {
		if (this.mimeType === 'application/vnd.google-apps.spreadsheet') {
			return await GoogleSheets.getData(this.id);
		}
		
		const file = await this.getLocalFile();
		
		if (this.mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') return await xlsx.getData(file);
		
		// TODO add JSON & JSONL support
		
		throw new UnsupportedError('mime type for data extraction', this.mimeType);
	}
	
	public async getTextContent(): Promise<string> {
		const buffer = await GoogleDrive.getContent(this.metadata);
		return buffer.toString('utf8');
	}
	
	public async toBase64(): Promise<string> {
		const buffer = await GoogleDrive.getContent(this.metadata);
		return buffer.toString('base64');
	}
	
	public toJSON(): JsonField {
		return this.metadata as JsonField;
	}
	
	public async toPDF(): Promise<string> {
		let metadata = this.metadata;
		
		if (!this.mimeType.startsWith('application/vnd.google-apps.'))
			metadata = await GoogleDrive.import(metadata, this.allowCache);
		
		return GoogleDrive.exportToPdf(metadata, this.allowCache);
	}
	
	private detectDataType(): ValueOf<typeof DataSource.DATA_TYPE> {
		const mapping = {
			'application/vnd.google-apps.document': 'text',
			'application/pdf': 'text',
			'text/plain': 'text',
			'application/vnd.google-apps.spreadsheet': 'data',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'data',
		};
		
		const dataType = mapping[this.mimeType];
		
		if (!dataType) throw new UnsupportedError('Google Drive data source mime type', this.mimeType, Object.keys(mapping));
		
		return dataType;
	}
}
