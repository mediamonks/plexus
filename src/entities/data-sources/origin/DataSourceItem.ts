import DataSource from '../DataSource';
import { JsonField } from '../../../types/common';

export default abstract class DataSourceItem<TTextContent, TDataContent> {
	private readonly _dataSource: DataSource;
	
	protected constructor(dataSource: DataSource) {
		this._dataSource = dataSource;
	}
	
	protected get dataSource(): DataSource {
		return this._dataSource;
	}
	
	public get allowCache(): boolean {
		return this.dataSource.configuration.allowCache;
	}
	
	public abstract get id(): string;
	
	public abstract get fileName(): string;
	
	public abstract toText(): Promise<TTextContent>;
	
	public abstract toData(): Promise<TDataContent>;
	
	public abstract toJSON(): JsonField;
	
	public abstract getLocalFile(): Promise<string>;
}
