import TargetDataSourceBehavior from './TargetDataSourceBehavior';
import CustomError from '../../error-handling/CustomError';

export default class ProfileTargetDataSourceBehavior extends TargetDataSourceBehavior {
	async read(): Promise<never> {
		throw new CustomError('Not implemented');
	}
	
	async ingest(): Promise<never> {
		throw new CustomError('Not implemented');
	}
	
	async query(): Promise<never> {
		throw new CustomError('Not implemented');
	}
	
	public async getData(): Promise<never> {
		throw new CustomError('Not implemented');
	}
}
