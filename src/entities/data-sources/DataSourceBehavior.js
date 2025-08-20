class DataSourceBehavior {
	_dataSource;
	
	constructor (dataSource) {
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
	
	async getData() {
		return this.dataSource.getData();
	}
	
	async getContents() {
		return this.dataSource.getContents();
	}
	
	async getItems() {
		return this.dataSource.getItems();
	}
	
	async getResolvedUri() {
		return this.dataSource.getResolvedUri();
	}
}

module.exports = DataSourceBehavior;
