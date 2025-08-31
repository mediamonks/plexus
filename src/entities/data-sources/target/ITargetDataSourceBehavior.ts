import DataSource from '../DataSource';

export default interface ITargetDataSourceBehavior {
	read(): Promise<typeof DataSource.OutputData>;
	
	ingest(): Promise<void>;
	
	query(parameters?: any): Promise<any>;
}
