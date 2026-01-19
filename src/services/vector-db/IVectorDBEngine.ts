import { JsonObject, JsonPrimitive, ToolCallSchemaProperty } from '../../types/common';

// TODO refactor method signatures
export default interface IVectorDBEngine<TQuery> {
	Query: TQuery;
	toolCallQuerySchema: ToolCallSchemaProperty;
	description: string;
	dropTable(name: string): Promise<void>;
	createTable(name: string, records: AsyncGenerator<JsonObject>): Promise<void>;
	append(tableName: string, records: AsyncGenerator<JsonObject>): Promise<void>;
	search(tableName: string, embeddings: number[], options: { limit?: number; filter?: Record<string, JsonPrimitive>; fields?: string[] }): Promise<JsonObject[]>;
	tableExists(tableName: string): Promise<boolean>;
	getIds(tableName: string): Promise<Set<string>>;
	query(query: TQuery): Promise<JsonObject[]>;
	getSchema(tableName: string): Promise<string>;
}
