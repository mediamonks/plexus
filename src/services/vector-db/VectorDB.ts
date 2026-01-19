import CloudSQL from './CloudSQL';
import LanceDB from './LanceDB';
import PgVector from './PgVector';
import LLM from '../llm/LLM';
import Config from '../../core/Config';
import Debug from '../../core/Debug';
import Profiler from '../../core/Profiler';
import { JsonObject, JsonPrimitive } from '../../types/common';

const ENGINES: Record<string, typeof VectorDB.Engine> = {
	lancedb: LanceDB,
	pgvector: PgVector,
	cloudsql: CloudSQL,
};

export default class VectorDB {
	public static readonly Configuration: {
		engine?: 'lancedb' | 'pgvector' | 'cloudsql';
	};
	
	public static readonly Query: typeof PgVector.Query | typeof LanceDB.Query;
	
	public static readonly Engine: typeof LanceDB | typeof PgVector | typeof CloudSQL;
	
	public static get engine(): typeof VectorDB.Engine {
		const engineName = Config.get('vectordb')?.engine ?? 'lancedb';
		return ENGINES[engineName];
	}
	
	public static async create(tableName: string, source: AsyncGenerator<JsonObject>): Promise<void> {
		const internalTableName = this.getInternalTableName(tableName);
		
		await this.engine.createTable(internalTableName, source);
	}
	
	public static async append(tableName: string, source: AsyncGenerator<JsonObject>): Promise<void> {
		const internalTableName = this.getInternalTableName(tableName);
		
		await this.engine.append(internalTableName, source);
	}
	
	public static async search(tableName: string, input: string, { limit, filter, fields }: { limit?: number; filter?: Record<string, JsonPrimitive>; fields?: string[] } = {}): Promise<JsonObject[]> {
		const embeddings = await LLM.generateQueryEmbeddings(input);
		return await Profiler.run(
			() => this.engine.search(this.getInternalTableName(tableName), embeddings, { limit, filter, fields }),
			`vectordb search ${tableName}`
		);
	}
	
	public static async drop(tableName: string): Promise<void> {
		return this.engine.dropTable(this.getInternalTableName(tableName));
	}
	
	public static async tableExists(tableName: string): Promise<boolean> {
		return this.engine.tableExists(this.getInternalTableName(tableName));
	}
	
	public static async getIds(tableName: string): Promise<Set<string>> {
		return this.engine.getIds(this.getInternalTableName(tableName));
	}
	
	public static async query(query: typeof VectorDB.Query): Promise<JsonObject[]> {
		if (typeof query === 'string') {
			query = await this.replaceEmbeddingPlaceholders(query);
		}
		
		Debug.dump('vectordb query', query);
		
		return this.engine.query(query as never); // TODO solve type hack
	}
	
	private static async replaceEmbeddingPlaceholders(query: string): Promise<string> {
		const regex = /EMBEDDING\('([^']+)'\)/g;
		let match;
		const replacements: { start: number; end: number; replacement: string }[] = [];
		
		while ((match = regex.exec(query))) {
			const text = match[1];
			const vector = await LLM.generateQueryEmbeddings(text);
			replacements.push({
				start: match.index,
				end: match.index + match[0].length,
				replacement: `'[${vector.join(',')}]'`
			});
		}
		
		// Apply replacements from back to front to avoid messing up indices
		for (let i = replacements.length - 1; i >= 0; i--) {
			const { start, end, replacement } = replacements[i];
			query = query.substring(0, start) + replacement + query.substring(end);
		}
		
		return query;
	}
	
	public static getInternalTableName(tableName: string): string {
		return `${tableName}_${LLM.embeddingModel}`.replace(/-/g, '_');
	}
}
