import DataSourceBehavior from '../DataSourceBehavior';

class ProfileDataSourceTarget extends DataSourceBehavior {
	static DataType: void;
	
	async read(): Promise<typeof ProfileDataSourceTarget.DataType> {
		throw new Error('Not implemented')
	}
	
	async ingest(): Promise<void> {
		throw new Error('Not implemented');
	}
	
	async query(): Promise<typeof ProfileDataSourceTarget.DataType> {
		throw new Error('Not implemented');
	}
}

export default ProfileDataSourceTarget;
