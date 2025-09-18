import DataSource from "./DataSource";
import DataSourceItem from "./platform/DataSourceItem";
import { ValueOf } from '../../types/common';

export default class DataSourceBehavior {
	private readonly _dataSource: DataSource;
	
	public constructor (dataSource: DataSource) {
		this._dataSource = dataSource;
	}
	
	public get dataSource(): DataSource {
		return this._dataSource;
	}
	
	public get id(): string {
		return this.dataSource.id;
	}
	
	public get source(): string {
		return this.dataSource.source;
	}
	
	public get dataType(): string {
		return this.dataSource.dataType;
	}
	
	public get target(): ValueOf<typeof DataSource.TARGET> {
		return this.dataSource.target;
	}
	
	public get isFolder(): boolean {
		return this.dataSource.isFolder;
	}

	public async getData(): Promise<any> {
		return this.dataSource.getData();
	}
	
	public async getContents(): Promise<typeof DataSource.Contents> {
		return this.dataSource.getContents();
	}
	
	public async getItems(): Promise<DataSourceItem[]> {
		return this.dataSource.getItems();
	}
	
	public async getResolvedUri(): Promise<string> {
		return this.dataSource.getResolvedUri();
	}
}
