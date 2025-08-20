const fs = require('node:fs/promises');
const DataSourceItem = require('./DataSourceItem');
const docs = require('../../../services/docs');
const drive = require('../../../services/drive');
const sheets = require('../../../services/sheets');
const pdf = require('../../../utils/pdf');
const UnsupportedError = require('../../../utils/UnsupportedError');
const xlsx = require('../../../utils/xlsx');

const LLM_SUPPORTED_MIME_TYPES = [
	'application/pdf',
	'text/plain',
	'application/json',
	'image/png',
];

class DriveDataSourceItem extends DataSourceItem {
	_metadata;
	
	constructor(dataSource, metadata) {
		super(dataSource);
		this._metadata = metadata;
	}
	
	get metadata() {
		return this._metadata;
	}
	
	get mimeType() {
		return this._metadata.mimeType;
	}
	
	detectDataType() {
		const mapping = {
			'application/vnd.google-apps.document': 'text',
			'application/pdf': 'text',
			'text/plain': 'text',
			'application/vnd.google-apps.spreadsheet': 'data',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'data',
		};
		
		const dataType = mapping[this.mimeType];
		
		if (!dataType) throw new UnsupportedError('Google Drive data source mime type', this.mimeType, mapping);
		
		return dataType;
	}
	
	async getLocalFile() {
		const { allowCache } = this.dataSource;
		
		const driveService = await drive();
		
		let metadata = this.metadata;
		
		if (LLM_SUPPORTED_MIME_TYPES.includes(this.mimeType))
			return (allowCache ? driveService.cacheFile(metadata) : driveService.downloadFile(metadata));
		
		if (!this.mimeType.startsWith('application/vnd.google-apps.'))
			metadata = await driveService.importFile(metadata, allowCache);
		
		return driveService.exportFile(metadata, 'pdf', allowCache);
	}
	
	async toText() {
		const { metadata } = this;
		
		if (metadata.mimeType === 'application/vnd.google-apps.document') return await (await docs()).getMarkdown(metadata.id);
		
		const file = await this.getLocalFile();
		
		if (metadata.mimeType === 'application/pdf') return await pdf.getPdfText(file);
		
		if (metadata.mimeType === 'text/plain') return (await fs.readFile(file)).toString();
	}
	
	async toData() {
		const { metadata } = this;
		
		if (metadata.mimeType === 'application/vnd.google-apps.spreadsheet') return await (await sheets()).getData(metadata.id);
		
		const file = await this.getLocalFile();
		
		if (metadata.mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') return await xlsx.getData(file);
	}
}

module.exports = DriveDataSourceItem;
