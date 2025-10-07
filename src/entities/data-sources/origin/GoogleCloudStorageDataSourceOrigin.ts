import DataSourceOrigin from './DataSourceOrigin';
import GoogleCloudStorageDataSourceItem from './GoogleCloudStorageDataSourceItem';
import gcs from '../../../services/gcs';
import { JsonObject } from '../../../types/common';

export default class GoogleCloudStorageDataSourceOrigin extends DataSourceOrigin {
	private _uri: string;
	
	public async getText(): Promise<string> {
		const items = await this.getItems();
		
		const contents = await Promise.all(items.map(item => item.toText()));
		
		return contents.join('\n\n');
	}
	
	public async getData(): Promise<AsyncGenerator<JsonObject>> {
		const items = await this.getItems();
		
		return (async function* () {
			for await (const item of items) {
				yield* await item.toData();
			}
		})();
	}
	
	public async getItems(): Promise<GoogleCloudStorageDataSourceItem[]> {
		const uris = await this.getUris();
		
		return uris.map(uri => new GoogleCloudStorageDataSourceItem(this.dataSource, uri));
	}
	
	private async getUris(): Promise<string[]> {
		const uri = await this.getUri();
		let isFolder = this.dataSource.configuration.isFolder;
		
		isFolder ??= gcs.isFolder(uri);
		
		if (isFolder) return await gcs.list(uri);
		
		return [uri];
	}
	
	private async getUri(): Promise<string> {
		return this._uri ??= await this.dataSource.getResolvedUri();
	}
}
