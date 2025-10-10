import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import DataSource from '../DataSource';
import DataSourceCatalogField from '../../catalog/DataSourceCatalogField';
import VectorDB from '../../VectorDB';

export default class VectorTargetDataSource extends DataSource {
	public async ingest(): Promise<void> {
		await VectorDB.drop(this.id);
		await VectorDB.create(this.id, this.generator());
	}
	
	public async query({ input, limit }: typeof DataSourceCatalogField.QueryParameters): Promise<string[]> {
		const embeddings = await VectorDB.generateQueryEmbeddings(input);
		
		const result = await VectorDB.search(this.id, embeddings, { limit, fields: ['text'] });
		
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
				yield { text: content, vector: await VectorDB.generateDocumentEmbeddings(content) };
			}
		}
	}
}
