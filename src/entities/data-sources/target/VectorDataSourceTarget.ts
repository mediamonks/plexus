import DataSourceBehavior from '../DataSourceBehavior';
import DataSourceItem from '../platform/DataSourceItem';
import StructuredDataSourceBehavior from '../data-type/StructuredDataSourceBehavior';
import vectordb from '../../../modules/vectordb';
import { JsonObject, SpreadSheet } from '../../../types/common';

class VectorDataSourceTarget extends DataSourceBehavior {
	static OutputData: AsyncGenerator<JsonObject>;

	async read(): Promise<typeof VectorDataSourceTarget.OutputData> {
		const contents = await this.getContents() as (typeof DataSourceItem.DataContent)[];

		return (async function* () {
			for await (const data of contents) {
				if (!(Symbol.asyncIterator in data)) throw new Error('Unsupported input data for vector target data source: must be JSONL');
				for await (const record of data) {
					yield { ...record, vector: await vectordb.generateDocumentEmbeddings(record) };
				}
			}
		})();
	}
	
	async ingest(): Promise<void> {
		// TODO support incremental ingesting
		await vectordb.drop(this.id);
		await vectordb.create(this.id, await this.read());
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
