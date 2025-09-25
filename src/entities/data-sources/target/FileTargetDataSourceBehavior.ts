import TargetDataSourceBehavior from './TargetDataSourceBehavior';
import DataSourceItem from '../platform/DataSourceItem';

export default class FileTargetDataSourceBehavior extends TargetDataSourceBehavior {
	public async read(): Promise<DataSourceItem[]> {
		return this.dataSource.getItems();
	};
	
	public async ingest(): Promise<void> {
		// TODO ingest by copying files to own gcs
		return console.warn(`Not ingesting files target data source "${this.dataSource.id}"`);
	}
	
	public async getIngestedData(): Promise<void> {
		throw new Error('Not implemented');
	}
	
	public async getData(): Promise<DataSourceItem[]> {
		return await this.dataSource.read() as DataSourceItem[];
	}
}
