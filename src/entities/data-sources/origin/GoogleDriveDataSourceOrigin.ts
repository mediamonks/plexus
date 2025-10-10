import DataSourceOrigin from './DataSourceOrigin';
import GoogleDriveDataSourceItem from './GoogleDriveDataSourceItem';
import CustomError from '../../error-handling/CustomError';
import drive, { FileMetaData } from '../../../services/drive';
import Debug from '../../../utils/Debug';
import { JsonObject } from '../../../types/common';

const GOOGLE_DRIVE_URI_PATTERN = /^https?:\/\/(?:drive|docs)\.google\.com\/(?:drive\/(?:u\/\d+\/)?(folders)|(?:file|document|spreadsheets|presentation)\/d)\/([\w\-]+)/;

export default class GoogleDriveDataSourceOrigin extends DataSourceOrigin {
	private _id: string;
	
	public async getText(): Promise<string> {
		const items = await this.getItems();
		
		const contents = await Promise.all(items.map(item => item.toText()));
		
		return contents.join('\n\n');
	}
	
	public async getData(): Promise<AsyncGenerator<JsonObject>> {
		const items = await this.getItems();
		
		return (async function* () {
			for await (const item of items) {
				yield item.toData();
			}
		})();
	}
	
	public async getItems(): Promise<GoogleDriveDataSourceItem[]> {
		const files = await this.getFiles();
		
		Debug.dump(`Data source "${this.dataSource.id}" files`, files);
		
		return files.map(metadata => new GoogleDriveDataSourceItem(this.dataSource, metadata));
	}
	
	private async getFiles(): Promise<FileMetaData[]> {
		const driveService = await drive();
		
		const id = await this.getId();
		
		const isFolder = this.dataSource.configuration.isFolder ?? await driveService.isFolder(id);
		
		if (isFolder) return await driveService.listFolderContents(id);
		
		return [await driveService.getFileMetadata(id)];
	}
	
	private async getId(): Promise<string> {
		if (this._id) return this._id;

		const uri = await this.dataSource.getResolvedUri();
		
		this._id = GOOGLE_DRIVE_URI_PATTERN.exec(uri)?.[2];
		
		if (!this._id) throw new CustomError(`Invalid Google Drive URI: ${uri}`);
		
		return this._id;
	}
}
