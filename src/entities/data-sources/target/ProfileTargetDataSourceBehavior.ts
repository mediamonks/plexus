import ITargetDataSourceBehavior from './ITargetDataSourceBehavior';
import DataSourceBehavior from '../DataSourceBehavior';
import { JsonObject } from '../../../types/common';

export default class ProfileTargetDataSourceBehavior extends DataSourceBehavior implements ITargetDataSourceBehavior {
	static InputData: void;
	static OutputData: JsonObject;
	
	async read(): Promise<typeof ProfileTargetDataSourceBehavior.OutputData> {
		throw new Error('Not implemented');
	}
	
	async ingest(): Promise<void> {
		throw new Error('Not implemented');
	}
	
	async query(): Promise<typeof ProfileTargetDataSourceBehavior.OutputData> {
		throw new Error('Not implemented');
	}
}
