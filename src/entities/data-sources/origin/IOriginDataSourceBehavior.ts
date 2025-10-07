import DataSourceItem from './DataSourceItem';

export default interface IOriginDataSourceBehavior<TContents> {
	read(): Promise<TContents>;
	
	getItems(): Promise<DataSourceItem<unknown, unknown>[] | never>;
}
