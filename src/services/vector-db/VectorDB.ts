import { SchemaLike } from '@lancedb/lancedb';
import LanceDB from './LanceDB';
import LLM from '../llm/LLM';
import Profiler from '../../core/Profiler';
import CustomError from '../../entities/error-handling/CustomError';
import { JsonObject, JsonPrimitive } from '../../types/common';

// TODO refactor this class

export default class VectorDB {
	public static async append(tableName: string, source: AsyncIterable<JsonObject>): Promise<void> {
		return LanceDB.append(this.getTableName(tableName), await Array.fromAsync(source));
	}
	
	public static async create(tableName: string, source: AsyncGenerator<JsonObject>, { schema }: { schema?: SchemaLike } = {}): Promise<void> {
		const promises = [];
		const internalTableName = this.getTableName(tableName);
		let tableCreated: Promise<void>;
		
		for await (const data of source) {
			promises.push((async () => {
				if (tableCreated) {
					await tableCreated;
					return LanceDB.append(internalTableName, [data]);
				}
				
				return tableCreated = LanceDB.createTable(internalTableName, [data], schema);
			})());
		}
		
		await Promise.all(promises);
	}
	
	public static async createEmpty(tableName: string, schema: SchemaLike): Promise<void> {
		schema.fields.find(field => field.name === 'vector').type.listSize = LLM.dimensions;
		await LanceDB.createTable(this.getTableName(tableName), [], schema);
	}
	
	public static async search(tableName: string, input: string, { limit, filter, fields }: { limit?: number; filter?: Record<string, JsonPrimitive>; fields?: string[] } = {}): Promise<JsonObject[]> {
		const embeddings = await LLM.generateQueryEmbeddings(input);
		
		return await Profiler.run(() => LanceDB.search(this.getTableName(tableName), embeddings, { limit, filter, fields }), `vectordb search ${tableName}`);
	}
	
	public static async ensureTableExists(tableName: string, schema: SchemaLike): Promise<void> {
		schema.fields.find(field => field.name === 'vector').type.listSize = LLM.dimensions;
		return LanceDB.ensureTableExists(this.getTableName(tableName), schema);
	}
	
	public static async ingest(tableName: string, source: AsyncIterable<JsonObject>, searchField: string = 'text', { excludeSearchField }: { excludeSearchField?: boolean } = {}): Promise<void> {
		const promises = [];
		const internalTableName = this.getTableName(tableName);
		
		for await (const data of source) {
			if (!data[searchField]) continue;
			
			if (typeof data[searchField] !== 'string') {
				throw new CustomError(`Vector search fields must be of type string, got type ${typeof data[searchField]} for table "${tableName}", field "${searchField}"`);
			}
			
			promises.push((async () => {
				const vector = await LLM.generateDocumentEmbeddings(data[searchField] as string);
				
				if (excludeSearchField) delete data[searchField];
				
				const record = { ...data, vector };
				
				return LanceDB.append(internalTableName, [record]);
			})());
		}
		
		await Promise.all(promises);
	}
	
	public static async drop(tableName: string): Promise<any> {
		return LanceDB.dropTable(this.getTableName(tableName));
	}
	
	public static async tableExists(tableName: string): Promise<boolean> {
		return LanceDB.tableExists(this.getTableName(tableName));
	}
	
	public static async getIds(tableName: string): Promise<Set<string>> {
		return LanceDB.getIds(this.getTableName(tableName));
	}
	
	private static getTableName(tableName: string): string {
		return `${tableName}-${LLM.embeddingModel}`;
	}
};
