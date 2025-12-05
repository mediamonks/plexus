import History from '../../core/History';
import DataSourceItem from '../../entities/data-sources/origin/DataSourceItem';

export type QueryOptions = {
	instructions?: string;
	history?: History;
	temperature?: number;
	maxTokens?: number;
	structuredResponse?: boolean;
	model?: string;
	files?: DataSourceItem<string, unknown>[];
};

export default interface ILLMPlatform {
	supportedMimeTypes: Set<string>;
	query(query: string, options?: QueryOptions): Promise<string>;
	generateQueryEmbeddings(query: string, model?: string): Promise<number[]>;
	generateDocumentEmbeddings(document: string, model?: string): Promise<number[]>;
	embeddingModel: string;
};
