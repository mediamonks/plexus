import DataSource from '../DataSource';
import DataSourceItem from '../origin/DataSourceItem';
import GoogleCloudStorageDataSourceItem from '../origin/GoogleCloudStorageDataSourceItem';
import Storage from '../../storage/Storage';

export default class FileTargetDataSource extends DataSource {
	declare protected readonly _configuration: typeof FileTargetDataSource.Configuration;
	
	public static readonly Configuration: typeof DataSource.Configuration & {
		incremental?: boolean;
	}
	
	public get configuration(): typeof FileTargetDataSource.Configuration {
		return {
			...super.configuration,
			incremental: this._configuration.incremental,
		} as typeof FileTargetDataSource.Configuration;
	}
	
	public async ingest(): Promise<void> {
		const items = await this.origin.getItems();
		await Promise.all(items.map(async item => {
			const localPath = await item.getLocalFile();
			return Storage.save(this.id, localPath, item.fileName);
		}));
		
		if (this.configuration.incremental) return;
		
		for (const file of await Storage.getFiles(this.id)) {
			if (items.find(item => item.fileName === file.name)) continue;
			
			await Storage.delete(this.id, file.internalName);
		}
	}
	
	public async query(): Promise<DataSourceItem<unknown, unknown>[]> {
		const files = await Storage.getFiles(this.id);
		
		// TODO use IngestedDataSourceItem
		if (files.length) return files.map(file => new GoogleCloudStorageDataSourceItem(this, file.uri, file.name));
		
		return this.origin.getItems();
	}
};
