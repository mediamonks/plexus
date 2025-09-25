import DataSource from '../DataSource';
import DataSourceItem from '../platform/DataSourceItem';
import { JsonArray, JsonObject } from '../../../types/common';

export default interface ITargetDataSourceBehavior {
	/* Reads and processes the source data */
	read(): Promise<string | AsyncGenerator<JsonObject> | DataSourceItem[]>;
	
	/* Calls read() to read the source data and writes it to the Storage */
	ingest(): Promise<void>;
	
	/* Reads the ingested data from the Storage */
	getIngestedData(): Promise<string | AsyncGenerator<JsonObject> | void>;
	
	/* Calls getIngestedData() if appropriate, otherwise calls read() */
	getData(): Promise<string | AsyncGenerator<JsonObject> | DataSourceItem[]>;
	
	/* Calls getData(), queries it if appropriate, returns the result in a format useful for the Catalog */
	query(parameters?: any): Promise<string | JsonArray | DataSourceItem[]>;
}
