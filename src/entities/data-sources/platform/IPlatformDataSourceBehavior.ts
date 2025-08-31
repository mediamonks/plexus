import DataSourceItem from '../platform/DataSourceItem';

export default interface IPlatformDataSourceBehavior {
  getItems(): Promise<DataSourceItem[]>;
}
