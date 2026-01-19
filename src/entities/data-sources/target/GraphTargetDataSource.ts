import DataSource from '../DataSource';
import DataSourceCatalogField from '../../catalog/DataSourceCatalogField';
import CustomError from '../../error-handling/CustomError';
import Debug from '../../../core/Debug';
import Neo4j from '../../../services/graph-db/Neo4j';
import { JsonObject } from '../../../types/common';

export default class GraphTargetDataSource extends DataSource {
	declare protected readonly _configuration: typeof GraphTargetDataSource.Configuration;
	
	public async query({ input }: typeof DataSourceCatalogField.QueryParameters): Promise<JsonObject[]> {
		try {
			Debug.log(`Executing Cypher query: ${input}`, 'GraphTargetDataSource');
			return await Neo4j.query(input);
		} catch (error) {
			throw new CustomError(`Graph query failed on data source "${this.id}": ${error}`);
		}
	}
	
	public async ingest(): Promise<void> {
		await Neo4j.clearByLabel(this.id);
		await Neo4j.createNodes(this.id, this.generator());
	}
	
	public async getToolCallSchema(): Promise<never> {
		throw new CustomError('Not implemented');
	}
	
	public async toolCall(): Promise<never> {
		throw new CustomError('Not implemented');
	}
	
	protected async *generator(): AsyncGenerator<JsonObject & { _id: string }> {
		const items = await this.origin.getItems();
		
		for await (const item of items) {
			const data = await item.toData();
			
			if (!(Symbol.iterator in data)) {
				throw new CustomError('Spreadsheet to graph data not yet supported');
			}
			
			for await (const record of data as AsyncGenerator<JsonObject>) {
				yield { ...record, _id: item.id };
			}
		}
	}
}
