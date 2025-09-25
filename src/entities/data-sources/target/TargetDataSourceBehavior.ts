import ITargetDataSourceBehavior from './ITargetDataSourceBehavior';
import DataSourceBehavior from '../DataSourceBehavior';
import StructuredDataSourceBehavior from '../data-type/StructuredDataSourceBehavior';
import DataSourceItem from '../platform/DataSourceItem';
import { JsonArray, JsonObject } from '../../../types/common';

export default abstract class TargetDataSourceBehavior extends DataSourceBehavior implements ITargetDataSourceBehavior {
	public abstract read(): Promise<string | AsyncGenerator<JsonObject> | DataSourceItem[]>;
	
	public async ingest(): Promise<void> {
		return this.dataSource.dataTypeBehavior.ingest();
	}
	
	public async getIngestedData(): Promise<string | AsyncGenerator<JsonObject> | void> {
		try {
			return this.dataSource.dataTypeBehavior.getIngestedData();
		} catch (error) {
			console.warn(`[WARN] Data source "${this.dataSource.id}" is not yet ingested`);
		}
	}
	
	public async getData(): Promise<string | AsyncGenerator<JsonObject> | DataSourceItem[]> {
		return (!this.dataSource.isDynamic && await this.getIngestedData()) || await this.read();
	}
	
	public async query(queryParameters?: typeof StructuredDataSourceBehavior.QueryParameters): Promise<string | JsonArray | DataSourceItem[]> {
		const data = await this.getData();
		const isAsyncIterator = data instanceof Object && Symbol.asyncIterator in data;
		
		return isAsyncIterator ? Array.fromAsync(data) : data;
	}
}
