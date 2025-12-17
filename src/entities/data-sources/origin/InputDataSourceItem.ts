import DataSourceItem from './DataSourceItem';
import LocalFileCache from '../../../services/LocalFileCache';
import { JsonObject } from '../../../types/common';
import hash from '../../../utils/hash';

export default class InputDataSourceItem extends DataSourceItem<string, unknown> {
	constructor(private _fileName: string, private _mimeType: string, private _base64: string) {
		super(null);
	}
	
	private _id?: string;
	
	public get id(): string {
		return this._id ??= hash(this._base64);
	}
	
	public get fileName(): string {
		return this._fileName;
	}
	
	public get mimeType(): string {
		return this._mimeType;
	}
	
	public async toText(): Promise<string> {
		return this.getTextContent();
	}
	
	public async toData(): Promise<JsonObject> {
		return JSON.parse(await this.getTextContent());
	}
	
	public async getTextContent(): Promise<string> {
		return Buffer.from(this._base64, 'base64').toString('utf-8');
	}
	
	public async toBase64(): Promise<string> {
		return this._base64;
	}
	
	public getLocalFile(): Promise<string> {
		return LocalFileCache.create(this._fileName, this._base64);
	}
}
