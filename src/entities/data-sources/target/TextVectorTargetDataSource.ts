import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import DataSource from '../DataSource';
import DataSourceCatalogField from '../../catalog/DataSourceCatalogField';
import vectordb from '../../../modules/vectordb';

export default class VectorTargetDataSource extends DataSource {
	public async ingest(): Promise<void> {
		await vectordb.drop(this.id);
		await vectordb.create(this.id, this.generator());
	}
	
	public async query({ input, limit }: typeof DataSourceCatalogField.QueryParameters): Promise<string[]> {
		const embeddings = await vectordb.generateQueryEmbeddings(input);
		
		const result = await vectordb.search(this.id, embeddings, { limit, fields: ['text'] });
		
		return result.map(item => item['text'] as string);
	}
	
	private async *generator(): AsyncGenerator<{ text: string, vector: number[] }> {
		const items = await this.origin.getItems();
		
		for (const item of items) {
			const text = await item.toText();
			
			const splitter = new RecursiveCharacterTextSplitter({
				chunkSize: 500,
				chunkOverlap: 200,
			});
			
			const chunks = await splitter.createDocuments([text]);
			
			for (const chunk of chunks) {
				const content = chunk.pageContent;
				if (!content) continue;
				yield { text: content, vector: await vectordb.generateDocumentEmbeddings(content) };
			}
		}
	}
}
