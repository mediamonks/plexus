import VectorTargetDataSource from './VectorTargetDataSource';
import DataSourceCatalogField from '../../catalog/DataSourceCatalogField';
import CustomError from '../../error-handling/CustomError';
import LLM from '../../../services/llm/LLM';
import VectorDB from '../../../services/vector-db/VectorDB';
import { JsonObject, VectorDBRecord } from '../../../types/common';
import hash from '../../../utils/hash';

export default class DataVectorTargetDataSource extends VectorTargetDataSource {
	declare protected readonly _configuration: typeof DataVectorTargetDataSource.Configuration;
	
	public static readonly Configuration: typeof VectorTargetDataSource.Configuration & {
		searchField?: string; // TODO for backwards compatibility
		vectorFields?: string[];
	}
	
	public get configuration(): typeof DataVectorTargetDataSource.Configuration {
		return {
			...super.configuration,
			vectorFields: this._configuration.vectorFields,
		} as typeof DataVectorTargetDataSource.Configuration;
	}
	
	protected get vectorFields(): string[] {
		const { searchField, vectorFields } = this.configuration;
		return vectorFields ?? (searchField && [searchField]) ?? [];
	}
	
	public async query({ input, limit, filter, fields }: typeof DataSourceCatalogField.QueryParameters): Promise<JsonObject[]> {
		try {
			return await VectorDB.search(this.id, input, { limit, filter, fields });
		} catch (error) {
			throw new CustomError(`Vector search failed on data source "${this.id}". Likely no ingested data exists for the current embedding model. (${error})`);
		}
	}
	
	protected async *generator(): AsyncGenerator<VectorDBRecord> {
		const items = await this.origin.getItems();
		
		for await (const item of items) {
			const data = await item.toData();
			
			if (!(Symbol.asyncIterator in data)) throw new CustomError('Spreadsheet to vector data not yet supported');
			
			for await (const record of data as AsyncGenerator<JsonObject>) {
				let vector: number[];
				if (this.vectorFields.length) {
					const text = this.vectorFields
						.map(field => record[field])
						.filter(Boolean)
						.join(' ');
					if (text.trim()) vector = await LLM.generateDocumentEmbeddings(text);
				}
				
				// TODO check if the source data contains _id, _source, or _vector, catch collision

				yield { ...record, _vector: vector, _source: item.id, _id: hash(JSON.stringify(record)) };
			}
		}
	}
};
