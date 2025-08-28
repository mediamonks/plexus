import DataSourceBehavior from '../DataSourceBehavior';

class FilesDataSourceTarget extends DataSourceBehavior {
	async read(): Promise<any[]> {
		return this.getItems();
	}
	
	async ingest(): Promise<void> {
		// TODO ingest by copying files to own gcs
		return console.warn(`Not ingesting files target data source "${this.id}"`);
	}
	
	async query(): Promise<any> {
		return this.getData();
	}
}

export default FilesDataSourceTarget;
