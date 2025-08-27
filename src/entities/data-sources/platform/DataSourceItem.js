class DataSourceItem {
	_dataType;
	
	static DATA_TYPE = {
		TEXT: 'text',
		DATA: 'data',
	}
	
	constructor(dataSource) {
		this._dataSource = dataSource;
	}
	
	get dataSource() {
		return this._dataSource;
	}
	
	get allowCache() {
		return this.dataSource.allowCache;
	}
	
	async detectDataType() {
		throw new Error('Cannot create instance of DataSourceItem');
	}
	
	async getDataType() {
		return this._dataType ??= this.dataSource.dataType ?? await this.detectDataType();
	}
	
	async toText() {
		throw new Error('Cannot create instance of DataSourceItem');
	}
	
	async toData() {
		throw new Error('Cannot create instance of DataSourceItem');
	}
	
	async getContent() {
		return {
			[this.constructor.DATA_TYPE.TEXT]: () => this.toText(),
			[this.constructor.DATA_TYPE.DATA]: () => this.toData(),
		}[await this.getDataType()]();
	}
}

module.exports = DataSourceItem;
