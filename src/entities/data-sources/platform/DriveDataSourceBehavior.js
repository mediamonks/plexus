const DataSourceBehavior = require('../DataSourceBehavior');
const DriveDataSourceItem = require('./DriveDataSourceItem');
const drive = require('../../../services/drive');

const GOOGLE_DRIVE_URI_PATTERN = /^https?:\/\/(?:drive|docs)\.google\.com\/(?:drive\/(?:u\/\d+\/)?(folders)|(?:file|document|spreadsheets|presentation)\/d)\/([\w\-]+)/;

class DriveDataSourceBehavior extends DataSourceBehavior {
	_id;
	
	async getFiles() {
		const driveService = await drive();
		
		const id = await this.getId();
		
		const isFolder = this.dataSource.isFolder ?? await driveService.isFolder(id);
		
		if (isFolder) return await driveService.listFolderContents(id);
		
		return [await driveService.getFileMetadata(id)];
	}
	
	async getItems() {
		const files = await this.getFiles();
		
		return files.map(metadata => new DriveDataSourceItem(this.dataSource, metadata));
	}
	
	async getId() {
		if (!this._id) this._id = this.source; // TODO for backwards compatibility
		
		if (!this._id) {
			const uri = await this.getResolvedUri();
			
			this._id = GOOGLE_DRIVE_URI_PATTERN.exec(uri)?.[2];
			
			if (!this._id) throw new Error(`Invalid Google Drive URI: ${uri}`);
		}
		
		return this._id;
	}
}

module.exports = DriveDataSourceBehavior;
