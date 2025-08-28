import DataSource from '../DataSource';
import { JsonObject, SpreadSheet, ValueOf } from '../../../types/common';
import DriveDataSourceItem from './DriveDataSourceItem';
import GcsDataSourceItem from './GcsDataSourceItem';

export default class DataSourceItem {
	_dataSource: DataSource;
	_dataType: ValueOf<typeof DataSourceItem.DATA_TYPE>;
	
	static TextContent: typeof DriveDataSourceItem.TextContent | typeof GcsDataSourceItem.TextContent;

	static DataContent: typeof DriveDataSourceItem.DataContent | typeof GcsDataSourceItem.DataContent;

	static Content: typeof DataSourceItem.TextContent | typeof DataSourceItem.DataContent;

	static DATA_TYPE = {
		TEXT: 'text',
		DATA: 'data',
	} as const;
	
	constructor(dataSource: any) {
		this._dataSource = dataSource;
	}
	
	get dataSource(): DataSource {
		return this._dataSource;
	}
	
	get allowCache(): boolean {
		return this.dataSource.allowCache;
	}

	get dataType(): ValueOf<typeof DataSourceItem.DATA_TYPE> {
		return this._dataType ??= this.dataSource.dataType ?? this.detectDataType();
	}
	
	detectDataType(): ValueOf<typeof DataSourceItem.DATA_TYPE> {
		throw new Error('Cannot create instance of DataSourceItem');
	}
	
	async toText(): Promise<string> {
		throw new Error('Cannot create instance of DataSourceItem');
	}
	
	async toData(): Promise<SpreadSheet | AsyncGenerator<JsonObject>> {
		throw new Error('Cannot create instance of DataSourceItem');
	}
	
	async getContent(): Promise<typeof DataSourceItem.Content> {
		return {
			[DataSourceItem.DATA_TYPE.TEXT]: () => this.toText(),
			[DataSourceItem.DATA_TYPE.DATA]: () => this.toData(),
		}[this.dataType]();
	}
}
