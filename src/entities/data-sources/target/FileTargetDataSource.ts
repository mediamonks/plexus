import DataSource from '../DataSource';
import DataSourceItem from '../origin/DataSourceItem';

export default class FileTargetDataSource extends DataSource {
	public async ingest(): Promise<void> {
		console.warn('Ingestion not implemented for file target data source');
	}
	
	public async query(): Promise<DataSourceItem<unknown, unknown>[]> {
		return this.origin.getItems();
	}
}
