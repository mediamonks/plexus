import DataSourceBehavior from '../DataSourceBehavior';

class ProfileDataSourceTarget extends DataSourceBehavior {
	async read(): Promise<any> {
		throw new Error('Not implemented')
	}
	
	async ingest(): Promise<void> {
		throw new Error('Not implemented');
	}
	
	async query(): Promise<any> {
		throw new Error('Not implemented');
	}
}

export default ProfileDataSourceTarget;
