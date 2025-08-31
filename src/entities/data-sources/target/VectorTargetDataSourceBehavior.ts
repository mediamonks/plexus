import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import ITargetDataSourceBehavior from './ITargetDataSourceBehavior';
import DataSourceBehavior from '../DataSourceBehavior';
import DataSourceItem from '../platform/DataSourceItem';
import StructuredDataSourceBehavior from '../data-type/StructuredDataSourceBehavior';
import vectordb from '../../../modules/vectordb';
import { JsonObject } from '../../../types/common';

export default class VectorTargetDataSourceBehavior extends DataSourceBehavior implements ITargetDataSourceBehavior {
	static OutputData: AsyncGenerator<JsonObject>;

	private async* textToChunks(text: string) {
		const splitter = new RecursiveCharacterTextSplitter({
			chunkSize: 500,
			chunkOverlap: 200,
		});
		
		const chunks = await splitter.createDocuments([text]);
		
		for (const chunk of chunks) {
			const text = chunk.pageContent;
			if (!text) continue;
			yield text;
		}
	}

	private async* textToRecords(text: string) {
		for await (const chunk of this.textToChunks(text)) {
			yield { text: chunk, vector: await vectordb.generateDocumentEmbeddings(chunk) };
		}
	}

	private async* dataToRecords(data: AsyncGenerator<JsonObject>) {
		for await (const record of data) {
			const text = record[this.dataSource.searchField];

			if (typeof text !== 'string') throw new Error('Vector target data source search field must be of type string');

			yield { ...record, vector: await vectordb.generateDocumentEmbeddings(text) };
		}
	}
	
	private async* textGenerator() {
		const contents = await this.getContents() as typeof DataSourceItem.TextContent[];
		
		for await (const data of contents) {
			yield* this.textToRecords(data);
		}
	}
	
	private async* dataGenerator() {
		const contents = await this.getContents() as typeof DataSourceItem.DataContent[];
		
		for await (const data of contents) {
			if (!(Symbol.asyncIterator in data)) throw new Error('Unsupported input data for vector target data source: must be JSONL');
			
			yield* this.dataToRecords(data);
		}
	}

	async read(): Promise<typeof VectorTargetDataSourceBehavior.OutputData> {
		return {
			[DataSourceItem.DATA_TYPE.UNSTRUCTURED]: this.textGenerator(),
			[DataSourceItem.DATA_TYPE.STRUCTURED]: this.dataGenerator(),
		}[this.dataType];
	}
	
	async ingest(): Promise<void> {
		// TODO support incremental ingesting
		await vectordb.drop(this.id);
		const data = await this.read();
		await vectordb.create(this.id, data);
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
