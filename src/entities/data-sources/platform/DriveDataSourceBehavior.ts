import DataSourceBehavior from '../DataSourceBehavior';
import DriveDataSourceItem from './DriveDataSourceItem';
import drive from '../../../services/drive';

const GOOGLE_DRIVE_URI_PATTERN = /^https?:\/\/(?:drive|docs)\.google\.com\/(?:drive\/(?:u\/\d+\/)?(folders)|(?:file|document|spreadsheets|presentation)\/d)\/([\w\-]+)/;

export default class DriveDataSourceBehavior extends DataSourceBehavior {
	_id;
	
	async getFiles(): Promise<any[]> {
		const driveService = await drive();
		
		const id = await this.getId();
		
		const isFolder = this.dataSource.isFolder ?? await driveService.isFolder(id);
		
		if (isFolder) return await driveService.listFolderContents(id);
		
		return [await driveService.getFileMetadata(id)];
	}
	
	async getItems(): Promise<DriveDataSourceItem[]> {
		const files = await this.getFiles();
		
		return files.map(metadata => new DriveDataSourceItem(this.dataSource, metadata));
	}
	
	async getId(): Promise<string> {
		if (!this._id) this._id = this.source; // TODO for backwards compatibility
		
		if (!this._id) {
			const uri = await this.getResolvedUri();
			
			this._id = GOOGLE_DRIVE_URI_PATTERN.exec(uri)?.[2];
			
			if (!this._id) throw new Error(`Invalid Google Drive URI: ${uri}`);
		}
		
		return this._id;
	}
}
