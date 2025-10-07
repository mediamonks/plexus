import DataSourceItem from './DataSourceItem';
import DataSource from '../DataSource';
import { JsonObject, SpreadSheet } from '../../../types/common';

export default abstract class DataSourceOrigin {
	private readonly _dataSource: DataSource;
	
	public constructor(dataSource: DataSource) {
		this._dataSource = dataSource;
	}
	
	public get dataSource(): DataSource {
		return this._dataSource;
	}
	
	public async getText(): Promise<string> {
		const items = await this.getItems();
		
		const contents = await Promise.all(items.map(item => item.toText()));
		
		return contents.join('\n\n');
	}
	
	public abstract getData(): Promise<AsyncGenerator<JsonObject>>;
	
	public abstract getItems(): Promise<DataSourceItem<string, AsyncGenerator<JsonObject> | SpreadSheet>[] | never>;
}
