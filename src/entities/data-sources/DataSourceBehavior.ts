import DataSource from "./DataSource";
import DataSourceItem from "./platform/DataSourceItem";

export default class DataSourceBehavior {
	_dataSource: DataSource;
	
	constructor (dataSource: DataSource) {
		this._dataSource = dataSource;
	}
	
	get dataSource(): DataSource {
		return this._dataSource;
	}
	
	get id(): string {
		return this.dataSource.id;
	}
	
	get source(): string {
		return this.dataSource.source;
	}
	
	get dataType(): string {
		return this.dataSource.dataType;
	}
	
	get target(): string {
		return this.dataSource.target;
	}
	
	get isFolder(): boolean {
		return this.dataSource.isFolder;
	}

	async getData(): Promise<any> {
		return this.dataSource.getData();
	}
	
	async getContents(): Promise<typeof DataSource.Contents> {
		return this.dataSource.getContents();
	}
	
	async getItems(): Promise<DataSourceItem[]> {
		return this.dataSource.getItems();
	}
	
	async getResolvedUri(): Promise<string> {
		return this.dataSource.getResolvedUri();
	}
}

