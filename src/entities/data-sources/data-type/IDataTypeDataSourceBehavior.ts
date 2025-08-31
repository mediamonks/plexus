import ITargetDataSourceBehavior from '../target/ITargetDataSourceBehavior';
import DataSource from '../DataSource';

export default interface IDataTypeDataSourceBehavior {
  targetBehavior: ITargetDataSourceBehavior;

  getIngestedData(): Promise<typeof DataSource.OutputData>;

  read(): Promise<typeof DataSource.OutputData>;

  ingest(): Promise<void>;
  
  query(parameters: any): Promise<typeof DataSource.OutputData>;
}
