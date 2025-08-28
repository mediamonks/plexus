class DataSourceBehavior {
	_dataSource;
	
	constructor (dataSource: any) {
		this._dataSource = dataSource;
	}
	
	get dataSource() {
		return this._dataSource;
	}
	
	get id() {
		return this.dataSource.id;
	}
	
	get source() {
		return this.dataSource.source;
	}
	
	get dataType() {
		return this.dataSource.dataType;
	}
	
	get target() {
		return this.dataSource.target;
	}
	
	get isFolder() {
		return this.dataSource.isFolder;
	}
	
	async getData(): Promise<any> {
		return this.dataSource.getData();
	}
	
	async getContents(): Promise<AsyncIterable<any>> {
		return this.dataSource.getContents();
	}
	
	async getItems(): Promise<any> {
		return this.dataSource.getItems();
	}
	
	async getResolvedUri(): Promise<string> {
		return this.dataSource.getResolvedUri();
	}
}

export default DataSourceBehavior;
