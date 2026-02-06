import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import VectorTargetDataSource from './VectorTargetDataSource';
import DataSourceCatalogField from '../../catalog/DataSourceCatalogField';
import CustomError from '../../error-handling/CustomError';
import LLM from '../../../services/llm/LLM';
import VectorDB from '../../../services/vector-db/VectorDB';
import { VectorDBRecord } from '../../../types/common';
import hash from '../../../utils/hash';

export default class TextVectorTargetDataSource extends VectorTargetDataSource {
	public async query({ input, limit }: typeof DataSourceCatalogField.QueryParameters): Promise<string[]> {
		try {
			const result = await VectorDB.search(this.id, input, { limit, fields: ['text'] });
			
			return result.map(item => item['text'] as string);
		} catch (error) {
			throw new CustomError(`Vector search failed on data source "${this.id}". Likely no ingested data exists for the current embedding model. (${error})`);
		}
		
	}
	
	protected vectorFields = ['text'];
	
	protected async *generator(): AsyncGenerator<VectorDBRecord> {
		const items = await this.origin.getItems();
		const { incremental } = this.configuration;
		let ingestedIds: Set<string> = new Set();
		
		if (incremental) ingestedIds = await this.getIngestedIds();
		
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
				
				const id = hash(content);
				if (incremental && ingestedIds.has(id)) continue;
				
				const vector = await LLM.generateDocumentEmbeddings(content);
				yield { text: content, _vector: vector, _source: item.id, _id: id };
			}
		}
	}
};
