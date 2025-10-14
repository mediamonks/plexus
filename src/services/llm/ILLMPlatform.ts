import History from '../../core/History';

export type QueryOptions = {
	systemInstructions?: string;
	history?: History;
	temperature?: number;
	maxTokens?: number;
	structuredResponse?: boolean;
	model?: string;
	files?: string[];
};

export default interface ILLMPlatform {
	query(query: string, options?: QueryOptions): Promise<string>;
	generateQueryEmbeddings(query: string): Promise<number[]>;
	generateDocumentEmbeddings(document: string): Promise<number[]>;
	embeddingModel: string;
};
