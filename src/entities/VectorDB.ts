import { SchemaLike } from '@lancedb/lancedb';
import CustomError from './error-handling/CustomError';
import Profiler from '../utils/Profiler';
import lancedb from '../services/lancedb';
import { JsonObject } from '../types/common';
import config from '../utils/config';
import embeddingModels from '../../data/embedding-models.json';
import azure from '../services/azure';
import openai from '../services/openai';
import genai from '../services/genai';
import UnsupportedError from './error-handling/UnsupportedError';

const PLATFORMS = {
	azure,
	openai,
	google: genai,
};

export default class VectorDB {
	static readonly _embeddings = {};
	
	private static async generateEmbeddings(text: string, forDocument: boolean = false): Promise<number[]> {
		if (!text) throw new CustomError('Error: No text provided when generating embeddings');
		
		const platform = this.getEmbeddingPlatform();
		
		const cachedEmbeddings = this._embeddings?.[platform]?.[text];
		
		if (cachedEmbeddings) return cachedEmbeddings;
		
		const embeddings = await Profiler.run(forDocument
				? PLATFORMS[platform].generateDocumentEmbeddings
				: PLATFORMS[platform].generateQueryEmbeddings,
			[text]) as number[];
		
		this._embeddings[platform] ??= {};
		this._embeddings[platform][text] ??= embeddings;
		
		return embeddings;
	}
	
	public static async generateDocumentEmbeddings(text: string): Promise<number[]> {
		return await this.generateEmbeddings(text, true);
	}
	
	public static async generateQueryEmbeddings(text: string): Promise<number[]> {
		return await this.generateEmbeddings(text);
	}
	
	public static async append(tableName: string, source: AsyncIterable<JsonObject>, searchField: string = 'text', schema: SchemaLike): Promise<void> {
		const promises = [];
		let internalTableName: string;
		
		for await (const data of source) {
			if (!data[searchField]) continue;
			
			if (typeof data[searchField] !== 'string') {
				throw new CustomError(`Vector search fields must be of type string, got type ${typeof data[searchField]} for table "${tableName}", field "${searchField}"`);
			}
			
			promises.push((async () => {
				try {
					const vector = await this.generateEmbeddings(data[searchField] as string, true);
					const record = { ...data, vector };
					
					internalTableName ??= this.getTableName(tableName, vector.length);
					
					await lancedb.ensureTableExists(internalTableName, schema);
					
					return lancedb.append(internalTableName, [record]);
				} catch (error) {
					console.error(error);
					console.debug(data);
				}
			})());
		}
		
		await Promise.all(promises);
	}
	
	public static async create(tableName: string, source: AsyncGenerator<JsonObject>, { schema }: { schema?: SchemaLike } = {}): Promise<void> {
		const promises = [];
		let dimensions: number, tableCreated: Promise<void>, internalTableName: string;
		
		for await (const data of source) {
			promises.push((async () => {
				if (dimensions) {
					await tableCreated;
					return lancedb.append(internalTableName, [data]);
				}
				
				dimensions = (data.vector as number[]).length;
				internalTableName = this.getTableName(tableName, dimensions);
				tableCreated = schema
					? this.createEmpty(internalTableName, schema).then(() => lancedb.append(internalTableName, [data]))
					: lancedb.createTable(internalTableName, [data], schema);
				
				return tableCreated;
			})());
		}
		
		await Promise.all(promises);
	}
	
	public static async createEmpty(tableName: string, schema: SchemaLike): Promise<void> {
		schema.fields.find(field => field.name === 'vector').type.listSize = this.getDimensions();
		await lancedb.createTable(this.getTableName(tableName), [], schema);
	}
	
	public static async search(tableName: string, embeddings: number[], { limit, filter, fields }: { limit?: number; filter?: JsonObject; fields?: string[] } = {}): Promise<JsonObject[]> {
		return await Profiler.run(() => lancedb.search(this.getTableName(tableName), embeddings, { limit, filter, fields }), `vectordb search ${tableName}`);
	}
	
	private static getEmbeddingPlatform(): string {
		const embeddingPlatform = config.get('embeddingPlatform') as string;
		
		if (!PLATFORMS[embeddingPlatform]) throw new UnsupportedError('embedding platform', embeddingPlatform, Object.keys(PLATFORMS));
		
		return embeddingPlatform;
	}
	
	private static getTableName(tableName: string, dimensions?: number): string {
		return `${tableName}-${dimensions ?? this.getDimensions()}`;
	}
	
	private static getDimensions(): number {
		const embeddingPlatform = this.getEmbeddingPlatform();
		if (!embeddingModels[PLATFORMS[embeddingPlatform].config.embeddingModel]) throw new CustomError('Error: Unsupported embedding model');
		return embeddingModels[PLATFORMS[embeddingPlatform].config.embeddingModel].dimensions;
	}
	
	public static async ensureTableExists(tableName: string, schema: SchemaLike): Promise<void> {
		schema.fields.find(field => field.name === 'vector').type.listSize = this.getDimensions();
		return lancedb.ensureTableExists(this.getTableName(tableName), schema);
	}
	
	public static async ingest(tableName: string, source: AsyncIterable<JsonObject>, searchField: string = 'text', { excludeSearchField }: { excludeSearchField?: boolean } = {}): Promise<void> {
		const promises = [];
		let dimensions: number;
		
		for await (const data of source) {
			if (!data[searchField]) continue;
			
			if (typeof data[searchField] !== 'string') {
				throw new CustomError(`Vector search fields must be of type string, got type ${typeof data[searchField]} for table "${tableName}", field "${searchField}"`);
			}
			
			promises.push((async () => {
				const vector = await this.generateEmbeddings(data[searchField] as string, true);
				
				if (excludeSearchField) delete data[searchField];
				
				const record = { ...data, vector };
				
				dimensions = vector.length;
				
				return lancedb.append(this.getTableName(tableName, dimensions), [record]);
			})());
		}
		
		await Promise.all(promises);
	}
	
	public static async drop(tableName: string): Promise<any> {
		return lancedb.dropTable(this.getTableName(tableName));
	}
	
};
