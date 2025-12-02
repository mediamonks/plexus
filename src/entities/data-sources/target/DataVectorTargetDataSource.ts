import DataSource from '../DataSource';
import DataSourceCatalogField from '../../catalog/DataSourceCatalogField';
import CustomError from '../../error-handling/CustomError';
import { JsonObject } from '../../../types/common';
import LLM from '../../../services/llm/LLM';
import VectorDB from '../../../services/vector-db/VectorDB';

export default class DataVectorTargetDataSource extends DataSource {
	public static Configuration: typeof DataSource.Configuration & {
		searchField: string;
	}
	
	get configuration(): typeof DataVectorTargetDataSource.Configuration {
		return {
			...super.configuration,
			searchField: this._configuration.searchField as string,
		};
	}
	
	public async ingest(): Promise<void> {
		await VectorDB.drop(this.id);
		await VectorDB.create(this.id, this.generator());
	}
	
	public async query({ input, limit, filter, fields }: typeof DataSourceCatalogField.QueryParameters): Promise<JsonObject[]> {
		try {
			return await VectorDB.search(this.id, input, { limit, filter, fields });
		} catch (error) {
			throw new CustomError(`Vector search failed on data source "${this.id}". Likely no ingested data exists for the current embedding model. (${error})`);
		}
	}
	
	private async *generator(): AsyncGenerator<JsonObject & { vector: number[] }> {
		const items = await this.origin.getItems();
		
		for await (const item of items) {
			const data = await item.toData();
			
			if (!(Symbol.iterator in data)) {
				throw new CustomError('Spreadsheet to vector data not yet supported');
			}
			
			for await (const record of data as AsyncGenerator<JsonObject>) {
				const text = record[this.configuration.searchField];
				
				if (typeof text !== 'string') throw new CustomError('Vector target data source search field must be of type string');
				
				yield { ...record, vector: await LLM.generateDocumentEmbeddings(text) };
			}
		}
	}
};
