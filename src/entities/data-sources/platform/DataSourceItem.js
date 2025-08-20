class DataSourceItem {
	constructor(dataSource) {
		this._dataSource = dataSource;
	}
	
	get dataSource() {
		return this._dataSource;
	}
	
	async detectDataType() {
		throw new Error('Cannot create instance of DataSourceItem');
	}
	
	async getDataType() {
		return this.dataSource.dataType ?? await this.detectDataType();
	}
	
	async toText() {
		throw new Error('Cannot create instance of DataSourceItem');
	}
	
	async toData() {
		throw new Error('Cannot create instance of DataSourceItem');
	}
	
	async getContent() {
		return {
			text: () => this.toText(),
			data: () => this.toData(),
		}[await this.getDataType()]();
	}
}

module.exports = DataSourceItem;
