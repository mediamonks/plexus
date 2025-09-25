import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import TargetDataSourceBehavior from './TargetDataSourceBehavior';
import DataSourceItem from '../platform/DataSourceItem';
import StructuredDataSourceBehavior from '../data-type/StructuredDataSourceBehavior';
import CustomError from '../../error-handling/CustomError';
import vectordb from '../../../modules/vectordb';
import { JsonArray, JsonObject } from '../../../types/common';

export default class VectorTargetDataSourceBehavior extends TargetDataSourceBehavior {
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

			if (typeof text !== 'string') throw new CustomError('Vector target data source search field must be of type string');

			yield { ...record, vector: await vectordb.generateDocumentEmbeddings(text) };
		}
	}
	
	private async* textGenerator() {
		const contents = await this.dataSource.getContents() as typeof DataSourceItem.TextContent[];
		
		for await (const data of contents) {
			yield* this.textToRecords(data);
		}
	}
	
	private async* dataGenerator() {
		const contents = await this.dataSource.getContents() as typeof DataSourceItem.DataContent[];
		
		for await (const data of contents) {
			if (!(Symbol.asyncIterator in data)) throw new CustomError('Unsupported input data for vector target data source: must be JSONL');
			
			yield* this.dataToRecords(data);
		}
	}

	async read(): Promise<AsyncGenerator<JsonObject>> {
		return {
			[DataSourceItem.DATA_TYPE.UNSTRUCTURED]: this.textGenerator(),
			[DataSourceItem.DATA_TYPE.STRUCTURED]: this.dataGenerator(),
		}[this.dataSource.dataType];
	}
	
	async ingest(): Promise<void> {
		// TODO support incremental ingesting
		await vectordb.drop(this.dataSource.id);
		const data = await this.read();
		await vectordb.create(this.dataSource.id, data);
	}
	
	public async getData(): Promise<AsyncGenerator<JsonObject>> {
		if (this.dataSource.isDynamic) throw new CustomError('Vector target data sources can not be dynamic');
		
		return await this.getIngestedData() as AsyncGenerator<JsonObject>;
	}
	
	async query({ input, limit, filter, fields }: typeof StructuredDataSourceBehavior.QueryParameters): Promise<JsonArray> {
		const embeddings = await vectordb.generateQueryEmbeddings(input);
		
		return {
			text: async () => {
				const result = await vectordb.search(this.dataSource.id, embeddings, { limit, fields: ['text'] });
				
				return result.map(item => item['text']);
			},
			data: () => vectordb.search(this.dataSource.id, embeddings, { limit, filter, fields }),
		}[this.dataSource.dataType]();
	}
}
