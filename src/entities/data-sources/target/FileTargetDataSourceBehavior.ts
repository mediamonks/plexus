import ITargetDataSourceBehavior from './ITargetDataSourceBehavior';
import DataSourceBehavior from '../DataSourceBehavior';
import DataSourceItem from '../platform/DataSourceItem';

export default class FileTargetDataSourceBehavior extends DataSourceBehavior implements ITargetDataSourceBehavior {
	static InputData: DataSourceItem[];
	static OutputData: DataSourceItem[];

	async read(): Promise<typeof FileTargetDataSourceBehavior.OutputData> {
		return this.getItems();
	};
	
	async ingest(): Promise<void> {
		// TODO ingest by copying files to own gcs
		return console.warn(`Not ingesting files target data source "${this.id}"`);
	}
	
	async query(): Promise<typeof FileTargetDataSourceBehavior.OutputData> {
		return this.getData();
	}
}
