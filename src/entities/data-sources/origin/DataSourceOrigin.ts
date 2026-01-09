import DataSourceItem from './DataSourceItem';
import DataSource from '../DataSource';
import { JsonObject, SpreadSheetData } from '../../../types/common';

export default abstract class DataSourceOrigin {
	
	public constructor(
		private readonly _dataSource: DataSource,
		private readonly _configuration: typeof DataSource.Configuration,
	) {};
	
	public get dataSource(): DataSource {
		return this._dataSource;
	}
	
	public async getText(): Promise<string> {
		const items = await this.getItems();
		
		const contents = await Promise.all(items.map(item => item.toText()));
		
		return contents.join('\n\n');
	}
	
	public abstract getData(): Promise<AsyncGenerator<JsonObject>>;
	
	public abstract getItems(): Promise<DataSourceItem<string, AsyncGenerator<JsonObject> | SpreadSheetData>[] | never>;
	
	protected get configuration(): typeof DataSource.Configuration {
		return this._configuration;
	}
}
