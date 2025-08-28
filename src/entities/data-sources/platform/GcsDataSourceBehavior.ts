import DataSourceBehavior from '../DataSourceBehavior';
import GcsDataSourceItem from './GcsDataSourceItem';
import gcs from '../../../services/gcs';

export default class GcsDataSourceBehavior extends DataSourceBehavior {
	_uri;
	
	async getUris(): Promise<string[]> {
		const uri = await this.getUri();
		let isFolder = this.isFolder;
		
		isFolder ??= gcs.isFolder(uri);
		
		if (isFolder) return await gcs.list(uri);
		
		return [uri];
	}
	
	async getItems(): Promise<GcsDataSourceItem[]> {
		const uris = await this.getUris();
		
		return uris.map(uri => new GcsDataSourceItem(this.dataSource, uri));
	}
	
	async getUri(): Promise<string> {
		return this._uri ??= this.source ?? await this.getResolvedUri(); // TODO for backwards compatibility
	}
}
