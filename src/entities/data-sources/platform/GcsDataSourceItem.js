const fs = require('node:fs/promises');
const path = require('node:path');
const DataSourceItem = require('./DataSourceItem');
const gcs = require('../../../services/gcs');
const jsonl = require('../../../utils/jsonl');
const pdf = require('../../../utils/pdf');
const UnsupportedError = require('../../../utils/UnsupportedError');

class GcsDataSourceItem extends DataSourceItem {
	_uri;
	
	constructor(dataSource, uri) {
		super(dataSource);
		this._uri = uri;
	}
	
	get uri() {
		return this._uri;
	}
	
	get extension() {
		return path.extname(this.uri).substring(1);
	}
	
	detectDataType() {
		return {
			pdf: 'text',
			txt: 'text',
			jsonl: 'data',
		}[this.extension];
	}
	
	async getLocalFile() {
		return gcs.cache(this.uri);
	}
	
	async toText() {
		const file = await this.getLocalFile();
		
		const mapping = {
			pdf: () => pdf.getPdfText(file),
			txt: async () => (await fs.readFile(file)).toString()
		};
		
		if (!mapping[this.extension]) throw new UnsupportedError('file type', this.extension, mapping);
		
		return await mapping[this.extension]();
	}
	
	async* toData() {
		return jsonl.read(await this.getLocalFile());
	}
}

module.exports = GcsDataSourceItem;
