import DataSourceBehavior from '../DataSourceBehavior';
import GcsDataSourceItem from './GcsDataSourceItem';
import gcs from '../../../services/gcs';

export default class GcsDataSourceBehavior extends DataSourceBehavior {
	private _uri;
	
	public async getUris(): Promise<string[]> {
		const uri = await this.getUri();
		let isFolder = this.isFolder;
		
		isFolder ??= gcs.isFolder(uri);
		
		if (isFolder) return await gcs.list(uri);
		
		return [uri];
	}
	
	public async getItems(): Promise<GcsDataSourceItem[]> {
		const uris = await this.getUris();
		
		return uris.map(uri => new GcsDataSourceItem(this.dataSource, uri));
	}
	
	private async getUri(): Promise<string> {
		return this._uri ??= this.source ?? await this.getResolvedUri(); // TODO for backwards compatibility
	}
}
