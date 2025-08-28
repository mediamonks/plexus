import DataSourceBehavior from '../DataSourceBehavior';
import StructuredDataSourceBehavior from '../data-type/StructuredDataSourceBehavior';
import vectordb from '../../../modules/vectordb';
import { JsonObject } from '../../../types/common';

class VectorDataSourceTarget extends DataSourceBehavior {
	async read(): Promise<() => AsyncGenerator<JsonObject>> {
		const contents = this.getContents();
		
		return async function* () {
			for await (const data of contents) {
				for await (const record of data) {
					yield { ...record, vector: await vectordb.generateDocumentEmbeddings(record) };
				}
			}
		};
	}
	
	async ingest(): Promise<void> {
		// TODO support incremental ingesting
		await vectordb.drop(this.id);
		await vectordb.create(this.id, this.read());
	}
	
	async query({ input, limit, filter, fields }: typeof StructuredDataSourceBehavior.QueryParameters): Promise<any> {
		const embeddings = await vectordb.generateQueryEmbeddings(input);
		
		return {
			text: async () => {
				const result = await vectordb.search(this.id, embeddings, { limit, fields: ['text'] });
				
				return result.map(item => item['text']);
			},
			data: () => vectordb.search(this.id, embeddings, { limit, filter, fields }),
		}[this.dataType]();
	}
}

export default VectorDataSourceTarget;
