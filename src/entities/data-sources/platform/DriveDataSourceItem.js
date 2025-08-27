const fs = require('node:fs/promises');
const DataSourceItem = require('./DataSourceItem');
const docs = require('../../../services/docs');
const drive = require('../../../services/drive');
const sheets = require('../../../services/sheets');
const pdf = require('../../../utils/pdf');
const UnsupportedError = require('../../../utils/UnsupportedError');
const xlsx = require('../../../utils/xlsx');
const Debug = require('../../../utils/Debug');

const LLM_SUPPORTED_MIME_TYPES = [
	'application/pdf',
	'text/plain',
	'application/json',
	'image/png',
	'image/jpeg',
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
	
	get fileName() {
		return this._metadata.name;
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
		const driveService = await drive();
		
		let metadata = this.metadata;
		
		if (LLM_SUPPORTED_MIME_TYPES.includes(this.mimeType))
			return (this.allowCache ? driveService.cacheFile(metadata) : driveService.downloadFile(metadata));
		
		if (!this.mimeType.startsWith('application/vnd.google-apps.'))
			metadata = await driveService.importFile(metadata, this.allowCache);
		
		return driveService.exportFile(metadata, 'pdf', this.allowCache);
	}
	
	async toText() {
		const { metadata } = this;
		
		if (metadata.mimeType === 'application/vnd.google-apps.document') {
			const docsService = await docs();
			return await docsService.getMarkdown(metadata.id);
		}
		
		const file = await this.getLocalFile();
		
		if (metadata.mimeType === 'application/pdf') return await pdf.getPdfText(file);
		
		if (metadata.mimeType === 'text/plain') {
			const buffer = await fs.readFile(file);
			return buffer.toString();
		}
		
		throw new UnsupportedError('mime type for text extraction', metadata.mimeType);
	}
	
	async toData() {
		const { metadata } = this;
		
		if (metadata.mimeType === 'application/vnd.google-apps.spreadsheet') {
			const sheetsService = await sheets();
			return await sheetsService.getData(metadata.id);
		}
		
		const file = await this.getLocalFile();
		
		if (metadata.mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') return await xlsx.getData(file);
		
		throw new UnsupportedError('mime type for data extraction', metadata.mimeType);
	}
}

module.exports = DriveDataSourceItem;
