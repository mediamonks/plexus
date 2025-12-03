import DataSource from '../DataSource';
import DataSourceItem from '../origin/DataSourceItem';
import GoogleCloudStorageDataSourceItem from '../origin/GoogleCloudStorageDataSourceItem';
import Storage from '../../storage/Storage';

export default class FileTargetDataSource extends DataSource {
	public async ingest(): Promise<void> {
		const items = await this.origin.getItems();
		await Promise.all(items.map(async item => {
			const localPath = await item.getLocalFile();
			return Storage.save(this.id, localPath);
		}));
	}
	
	public async query(): Promise<DataSourceItem<unknown, unknown>[]> {
		const uris = await Storage.getFiles(this.id);
		
		if (uris.length) return uris.map(uri => new GoogleCloudStorageDataSourceItem(this, uri));
		
		return this.origin.getItems();
	}
};
