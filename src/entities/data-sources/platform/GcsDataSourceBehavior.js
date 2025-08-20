const DataSourceBehavior = require('../DataSourceBehavior');
const GcsDataSourceItem = require('./GcsDataSourceItem');
const gcs = require('../../../services/gcs');

class GcsDataSourceBehavior extends DataSourceBehavior {
	_uri;
	
	async getUris() {
		const uri = await this.getUri();
		let isFolder = this.isFolder;
		
		isFolder ??= await gcs.isFolder(uri);
		
		if (isFolder) return await gcs.list(uri);
		
		return [uri];
	}
	
	async getItems() {
		const uris = await this.getUris();
		
		return uris.map(uri => new GcsDataSourceItem(this.dataSource, uri));
	}
	
	async getUri() {
		return this._uri ??= this.source ?? await this.getResolvedUri(); // TODO for backwards compatibility
	}
}

module.exports = GcsDataSourceBehavior;
