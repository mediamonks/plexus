import DataSource from '../DataSource';
import DataSourceItem from '../origin/DataSourceItem';

export default class FileTargetDataSource extends DataSource {
	public async ingest(): Promise<void> {
		// TODO copy file to Storage, query should return only gs:// uris when using Gemini
		console.warn('Ingestion not implemented for file target data source');
	}
	
	public async query(): Promise<DataSourceItem<unknown, unknown>[]> {
		return this.origin.getItems();
	}
};
