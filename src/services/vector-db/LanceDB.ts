import { performance } from 'node:perf_hooks';
import lancedb, { Connection, SchemaLike, Table } from '@lancedb/lancedb';
import Config from '../../core/Config';
import IVectorDBEngine from './IVectorDBEngine';
import { JsonObject, JsonPrimitive, staticImplements } from '../../types/common';

const _tables: Record<string, Table> = {};
const lastTableWrites: Record<string, number> = {};
const tableRecordBuffers: Record<string, JsonObject[]> = {};
const tableWriteTimeouts: Record<string, Promise<void>> = {};

@staticImplements<IVectorDBEngine<JsonObject>>()
export default class LanceDB {
	public static readonly Configuration: {
		databaseUri?: string;
		rateLimitDelayMs?: number;
	};
	
	private static _connection: Connection;
	
	private static get configuration(): typeof LanceDB.Configuration {
		return Config.get('lancedb');
	}
	
	public static async dropTable(name: string): Promise<void> {
		const connection = await this.getConnection();
		
		const tableNames = await connection.tableNames();
		if (tableNames.includes(name)) {
			await connection.dropTable(name);
		}
	}
	
	public static async createTable(name: string, records: AsyncGenerator<JsonObject>): Promise<void> {
		const connection = await this.getConnection();
		const firstRecord = await records.next();
		
		if (firstRecord.done) return;
		
		lastTableWrites[name] = performance.now();
		await connection.createTable(name, [firstRecord.value]);
		
		await this.append(name, records);
	}
	
	public static async append(tableName: string, records: AsyncGenerator<JsonObject>): Promise<void> {
		for await (const record of records) {
			tableRecordBuffers[tableName] ??= [];
			tableRecordBuffers[tableName].push(record);
			tableWriteTimeouts[tableName] ??= new Promise(resolve => setTimeout(
				() => this.writeRecordBuffer(tableName).then(resolve),
				Math.max(0, (lastTableWrites[tableName] ?? 0) + this.configuration.rateLimitDelayMs - performance.now())
			));
			
			await tableWriteTimeouts[tableName];
		}
	}
	
	public static async upsert(tableName: string, records: JsonObject[]): Promise<void> {
		const table = await this.getTable(tableName);
		await table.mergeInsert('id')
			.whenMatchedUpdateAll()
			.whenNotMatchedInsertAll()
			.execute(records);
	}
	
	public static async search(tableName: string, embeddings: number[], { limit = 3, filter, fields }: { limit?: number; filter?: Record<string, JsonPrimitive>; fields?: string[] }): Promise<JsonObject[]> {
		const table = await this.getTable(tableName);
		
		let vectorQuery = table.vectorSearch(embeddings);
		
		if (fields) vectorQuery = vectorQuery.select(fields);
		
		if (filter) vectorQuery = vectorQuery.where(
			Object.keys(filter).map(key => {
				const value = filter[key];
				if (value === null) return `${key} IS NULL`;
				if (typeof value === 'string') return `${key} = '${value.replace(/'/g, "''")}'`;
				return `${key} = ${value}`;
			}).join(' AND ')
		);
		
		return await vectorQuery
			.distanceType('cosine')
			.limit(limit)
			.toArray();
	}
	
	public static async ensureTableExists(name: string, schema: SchemaLike): Promise<void> {
		if (_tables[name]) return;
		
		const connection = await this.getConnection();
		try {
			_tables[name] = await connection.openTable(name);
		} catch (error) {
			lastTableWrites[name] = performance.now();
			_tables[name] = await connection.createEmptyTable(name, schema);
		}
	}
	
	public static async tableExists(tableName: string): Promise<boolean> {
		const connection = await this.getConnection();
		return (await connection.tableNames()).includes(tableName);
	}
	
	public static async getIds(tableName: string): Promise<Set<string>> {
		const table = await this.getTable(tableName);
		const records = await table.query().select(['_id']).toArray();
		return new Set(records.map(item => item._id));
	}
	
	public static async query(query: JsonObject): Promise<JsonObject[]> {
		const { tableName, vector, where, select, limit } = query as any;
		const table = await this.getTable(tableName);
		return table.vectorSearch(vector).where(where).select(select).limit(limit).toArray();
	}
	
	private static async getConnection(): Promise<Connection> {
		if (this._connection) return this._connection;
		
		let { databaseUri } = this.configuration;
		
		if (!databaseUri) {
			const bucket = Config.get('storage/bucket') as string;
			databaseUri = `gs://${bucket}/lancedb`;
		}
		
		this._connection = await lancedb.connect(databaseUri);
		
		return this._connection;
	}
	
	private static async getTable(name: string): Promise<Table> {
		const connection = await this.getConnection();
		
		_tables[name] ??= await connection.openTable(name);
		
		return _tables[name];
	}
	
	private static async writeRecordBuffer(tableName: string): Promise<void> {
		lastTableWrites[tableName] = performance.now();
		delete tableWriteTimeouts[tableName];
		if (!tableRecordBuffers[tableName]) return;
		const table = await this.getTable(tableName);
		await table.add(tableRecordBuffers[tableName]);
		delete tableRecordBuffers[tableName];
	}
};
