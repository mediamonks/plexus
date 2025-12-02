import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import DataSource from '../DataSource';
import DataSourceCatalogField from '../../catalog/DataSourceCatalogField';
import LLM from '../../../services/llm/LLM';
import VectorDB from '../../../services/vector-db/VectorDB';
import CustomError from '../../error-handling/CustomError';

export default class TextVectorTargetDataSource extends DataSource {
	public async ingest(): Promise<void> {
		await VectorDB.drop(this.id);
		await VectorDB.create(this.id, this.generator());
	}
	
	public async query({ input, limit }: typeof DataSourceCatalogField.QueryParameters): Promise<string[]> {
		try {
			const result = await VectorDB.search(this.id, input, { limit, fields: ['text'] });
			
			return result.map(item => item['text'] as string);
		} catch (error) {
			throw new CustomError(`Vector search failed on data source "${this.id}". Likely no ingested data exists for the current embedding model. (${error})`);
		}
		
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
				yield { text: content, vector: await LLM.generateDocumentEmbeddings(content) };
			}
		}
	}
};
