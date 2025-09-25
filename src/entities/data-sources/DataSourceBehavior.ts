import DataSource from "./DataSource";

export default class DataSourceBehavior {
	private readonly _dataSource: DataSource;
	
	public constructor (dataSource: DataSource) {
		this._dataSource = dataSource;
	}
	
	public get dataSource(): DataSource {
		return this._dataSource;
	}
}
