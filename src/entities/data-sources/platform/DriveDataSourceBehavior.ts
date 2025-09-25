import DataSourceBehavior from '../DataSourceBehavior';
import DriveDataSourceItem from './DriveDataSourceItem';
import CustomError from '../../error-handling/CustomError';
import drive, { FileMetaData } from '../../../services/drive';

const GOOGLE_DRIVE_URI_PATTERN = /^https?:\/\/(?:drive|docs)\.google\.com\/(?:drive\/(?:u\/\d+\/)?(folders)|(?:file|document|spreadsheets|presentation)\/d)\/([\w\-]+)/;

export default class DriveDataSourceBehavior extends DataSourceBehavior {
	private _id: string;
	
	public async getItems(): Promise<DriveDataSourceItem[]> {
		const files = await this.getFiles();
		
		return files.map(metadata => new DriveDataSourceItem(this.dataSource, metadata));
	}
	
	private async getFiles(): Promise<FileMetaData[]> {
		const driveService = await drive();
		
		const id = await this.getId();
		
		const isFolder = this.dataSource.isFolder ?? await driveService.isFolder(id);
		
		if (isFolder) return await driveService.listFolderContents(id);
		
		return [await driveService.getFileMetadata(id)];
	}
	
	private async getId(): Promise<string> {
		if (!this._id) this._id = this.dataSource.source; // TODO for backwards compatibility
		
		if (!this._id) {
			const uri = await this.dataSource.getResolvedUri();
			
			this._id = GOOGLE_DRIVE_URI_PATTERN.exec(uri)?.[2];
			
			if (!this._id) throw new CustomError(`Invalid Google Drive URI: ${uri}`);
		}
		
		return this._id;
	}
}
