import DataSource from '../DataSource';
import { JsonObject, SpreadSheet, ValueOf } from '../../../types/common';
import DriveDataSourceItem from './DriveDataSourceItem';
import GcsDataSourceItem from './GcsDataSourceItem';

export default abstract class DataSourceItem {
	private readonly _dataSource: DataSource;
	private _dataType: ValueOf<typeof DataSourceItem.DATA_TYPE>;
	
	static readonly TextContent: typeof DriveDataSourceItem.TextContent | typeof GcsDataSourceItem.TextContent;

	static readonly DataContent: typeof DriveDataSourceItem.DataContent | typeof GcsDataSourceItem.DataContent;

	static readonly Content: typeof DataSourceItem.TextContent | typeof DataSourceItem.DataContent;

	static readonly DATA_TYPE = {
		UNSTRUCTURED: 'text',
		STRUCTURED: 'data',
	} as const;
	
	protected constructor(dataSource: any) {
		this._dataSource = dataSource;
	}
	
	protected get dataSource(): DataSource {
		return this._dataSource;
	}
	
	public get allowCache(): boolean {
		return this.dataSource.allowCache;
	}

	public get dataType(): ValueOf<typeof DataSourceItem.DATA_TYPE> {
		return this._dataType ??= this.dataSource.dataType ?? this.detectDataType();
	}
	
	protected detectDataType(): ValueOf<typeof DataSourceItem.DATA_TYPE> {
		throw new Error('Cannot create instance of DataSourceItem');
	}
	
	public abstract toText(): Promise<string>;
	
	public abstract toData(): Promise<SpreadSheet | AsyncGenerator<JsonObject>>;
	
	public async getContent(): Promise<typeof DataSourceItem.Content> {
		return {
			[DataSourceItem.DATA_TYPE.UNSTRUCTURED]: () => this.toText(),
			[DataSourceItem.DATA_TYPE.STRUCTURED]: () => this.toData(),
		}[this.dataType]();
	}
}
