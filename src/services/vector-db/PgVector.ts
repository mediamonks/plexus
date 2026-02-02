import path from 'node:path';
import pg from 'pg';
import Config from '../../core/Config';
import Docker, { ContainerOptions } from '../docker/Docker';
import IVectorDBEngine from './IVectorDBEngine';
import { JsonObject, JsonPrimitive, SchemaProperty, staticImplements } from '../../types/common';

const CONTAINER_PORT = 5432;
const IMAGE = 'pgvector/pgvector:pg17';

@staticImplements<IVectorDBEngine<string>>()
export default class PgVector {
	private static _client: pg.Pool;
	private static _port: number;
	
	public static readonly Query: string;
	
	public static readonly description = 'PostgreSQL+PgVector';
	
	public static async dropTable(name: string): Promise<void> {
		const client = await this.getClient();
		await client.query(`DROP TABLE IF EXISTS "${name}"`);
	}
	
	public static async createTable(name: string, records: AsyncGenerator<JsonObject>): Promise<void> {
		const client = await this.getClient();
		
		await client.query(`DROP TABLE IF EXISTS "${name}"`);
		
		const firstRecord = await records.next();
		
		if (firstRecord.done) return;
		
		const columns = this.inferColumns(firstRecord.value);
		await client.query(`CREATE TABLE "${name}" (${columns})`);
		
		async function* prependFirst(): AsyncGenerator<JsonObject> {
			yield firstRecord.value;
			for await (const record of records) {
				yield record;
			}
		}
		
		await this.append(name, prependFirst());
	}
	
	public static async append(tableName: string, records: AsyncGenerator<JsonObject>): Promise<void> {
		const client = await this.getClient();
		const batch: JsonObject[] = [];
		const batchSize = 100;
		
		for await (const record of records) {
			batch.push(record);
			if (batch.length >= batchSize) {
				await this.executeBatchInsert(client, tableName, batch);
				batch.length = 0;
			}
		}
		
		if (batch.length > 0) {
			await this.executeBatchInsert(client, tableName, batch);
		}
	}
	
	public static async search(
		tableName: string,
		embeddings: number[],
		{ limit = 3, filter, fields }: { limit?: number; filter?: Record<string, JsonPrimitive>; fields?: string[] }
	): Promise<JsonObject[]> {
		const client = await this.getClient();
		
		const selectFields = fields ? fields.map(f => `"${f}"`).join(', ') : '*';
		const vectorParam = `[${embeddings.join(',')}]`;
		
		let query = `SELECT ${selectFields}, vector <=> $1 AS _distance FROM "${tableName}"`;
		const params: unknown[] = [vectorParam];
		
		if (filter && Object.keys(filter).length > 0) {
			const conditions = Object.entries(filter).map(([key, value], i) => {
				params.push(value);
				return `"${key}" = $${i + 2}`;
			});
			query += ` WHERE ${conditions.join(' AND ')}`;
		}
		
		query += ` ORDER BY vector <=> $1 LIMIT ${limit}`;
		
		const result = await client.query(query, params);
		
		return result.rows.map(({ _distance, ...row }) => row);
	}
	
	public static async tableExists(tableName: string): Promise<boolean> {
		const client = await this.getClient();
		const result = await client.query(
			`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)`,
			[tableName]
		);
		return result.rows[0].exists;
	}
	
	public static async getIds(tableName: string): Promise<Set<string>> {
		const client = await this.getClient();
		const result = await client.query(`SELECT "_id" FROM "${tableName}"`);
		return new Set(result.rows.map(row => row._id));
	}
	
	public static async query(query: typeof PgVector.Query): Promise<JsonObject[]> {
		const client = await this.getClient();
		const result = await client.query(query);
		return result.rows;
	}
	
	public static readonly toolCallQuerySchema: SchemaProperty = {
		type: 'string' as const,
		description: 'PostgreSQL query string. Use PostgreSQL syntax only (NOT SQLite).',
	};
	
	public static async getSchema(tableName: string) {
		const client = await this.getClient();
		const result = await client.query(`SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = $1`, [tableName]);
		return result.rows.map(({ column_name, data_type, is_nullable }) => `${column_name} ${data_type} ${is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`).join(', ');
	}
	
	private static async getClient(): Promise<pg.Pool> {
		if (this._client) return this._client;
		
		const ports = await Docker.start(this.getContainerConfig());
		this._port = ports[CONTAINER_PORT];
		
		this._client = new pg.Pool({
			host: 'localhost',
			port: this._port,
			user: 'postgres',
			password: 'postgres',
			database: 'postgres',
		});
		
		await this._client.query('CREATE EXTENSION IF NOT EXISTS vector');
		
		return this._client;
	}
	
	private static getContainerConfig(): ContainerOptions {
		const dataDir = path.resolve(Config.get('tempPath'), 'pgvector-data');
		
		return {
			image: IMAGE,
			ports: [CONTAINER_PORT],
			binds: [`${dataDir}:/var/lib/postgresql/data`],
			env: ['POSTGRES_PASSWORD=postgres'],
			healthCheck: { port: CONTAINER_PORT, tcp: true },
		};
	}
	
	private static async executeBatchInsert(client: pg.Pool, tableName: string, records: JsonObject[]): Promise<void> {
		if (records.length === 0) return;
		
		const columns = Object.keys(records[0]);
		const placeholders = records.map((_, i) =>
			`(${columns.map((_, j) => `$${i * columns.length + j + 1}`).join(', ')})`
		).join(', ');
		
		const values = records.flatMap(record =>
			columns.map(col => {
				const val = record[col];
				if (col === 'vector' && Array.isArray(val)) return JSON.stringify(val);
				return val;
			})
		);
		
		await client.query(
			`INSERT INTO "${tableName}" (${columns.map(c => `"${c}"`).join(', ')}) VALUES ${placeholders}`,
			values
		);
	}
	
	private static inferColumns(record: JsonObject): string {
		const columns: string[] = ['id SERIAL PRIMARY KEY'];
		
		for (const [key, value] of Object.entries(record)) {
			if (key === 'id') continue;
			if (key === 'vector' || key === '_vector') {
				const dimensions = Array.isArray(value) ? value.length : 0;
				if (dimensions === 0) throw new Error('Vector field must be a non-empty array');
				columns.push(`vector vector(${dimensions})`);
			} else if (typeof value === 'number') {
				columns.push(`"${key}" DOUBLE PRECISION`);
			} else if (typeof value === 'boolean') {
				columns.push(`"${key}" BOOLEAN`);
			} else {
				columns.push(`"${key}" TEXT`);
			}
		}
		
		return columns.join(', ');
	}
}
