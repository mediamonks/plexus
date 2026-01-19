import pg from 'pg';
import { Connector, IpAddressTypes, AuthTypes } from '@google-cloud/cloud-sql-connector';
import IVectorDBEngine from './IVectorDBEngine';
import GoogleAuthClient from '../google-drive/GoogleAuthClient';
import Config from '../../core/Config';
import Profiler from '../../core/Profiler';
import { JsonObject, JsonPrimitive, ToolCallSchemaProperty, staticImplements } from '../../types/common';

@staticImplements<IVectorDBEngine<string>>()
export default class CloudSQL {
	public static readonly Configuration: {
		projectId: string;
		location: string;
		instanceId: string;
		user: string;
		database: string;
	};
	
	public static readonly Query: string;
	
	public static readonly description = 'PostgreSQL+PgVector';

	private static _client: pg.Pool;
	
	private static get configuration(): typeof CloudSQL.Configuration {
		return Config.get('cloud-sql', { includeGlobal: true }) as typeof CloudSQL.Configuration;
	}
	
	public static async dropTable(name: string): Promise<void> {
		const client = await this.getClient();
		await client.query(`DROP TABLE IF EXISTS "${name}"`);
	}
	
	public static async createTable(name: string, records: AsyncGenerator<JsonObject>): Promise<void> {
		const client = await this.getClient();
		
		const firstRecord = await records.next();
		
		if (firstRecord.done) return;
		
		const columns = this.inferColumns(firstRecord.value);
		await client.query(`CREATE TABLE "${name}" (${columns})`);
		
		async function* prependFirst(): AsyncGenerator<JsonObject> {
			yield firstRecord.value;
			for await (const record of records) yield record;
		}
		
		await this.append(name, prependFirst());
	}
	
	public static async append(tableName: string, records: AsyncGenerator<JsonObject>): Promise<void> {
		const batch: JsonObject[] = [];
		const batchSize = 100;
		
		for await (const record of records) {
			batch.push(record);
			if (batch.length >= batchSize) {
				await this.executeBatchInsert(tableName, batch);
				batch.length = 0;
			}
		}
		
		if (batch.length > 0) {
			await this.executeBatchInsert(tableName, batch);
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
	
	public static async query(query: typeof CloudSQL.Query): Promise<JsonObject[]> {
		return await Profiler.run(async () => {
			const client = await this.getClient();
			const result = await client.query(query);
			return result.rows;
		}, 'CloudSQL.query');
	}
	
	public static readonly toolCallQuerySchema: ToolCallSchemaProperty = {
		type: 'string' as const,
		description: 'PostgreSQL+PgVector query string',
	};
	
	public static async getSchema(tableName: string): Promise<string> {
		const client = await this.getClient();
		const result = await client.query(`SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = $1`, [tableName]);
		return result.rows.map(({ column_name, data_type, is_nullable }) => `${column_name} ${data_type} ${is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`).join(', ');
	}
	
	private static get instanceConnectionName(): string {
		return `${this.configuration.projectId}:${this.configuration.location}:${this.configuration.instanceId}`;
	}
	
	private static async getClient(): Promise<pg.Pool> {
		if (this._client) return this._client;
		
		const { user, database } = this.configuration;
		
		const auth = await GoogleAuthClient.get();
		
		const connector = new Connector({
			auth,
		});
		
		const clientOptions = await connector.getOptions({
			instanceConnectionName: this.instanceConnectionName,
			ipType: IpAddressTypes.PUBLIC,
			authType: AuthTypes.IAM,
		});

		this._client = new pg.Pool({
			...clientOptions,
			user,
			database,
		});
		
		return this._client;
	}
	
	private static async executeBatchInsert(tableName: string, records: JsonObject[]): Promise<void> {
		if (records.length === 0) return;
		
		const client = await this.getClient();
		const columns = Object.keys(records[0]);
		
		const placeholders = records.map((_, i) =>
			`(${columns.map((_, j) => `$${i * columns.length + j + 1}`).join(', ')})`
		).join(', ');
		
		const values = records.flatMap(record =>
			columns.map(col => {
				const val = record[col];
				if (col === '_vector' && Array.isArray(val)) return JSON.stringify(val);
				return val;
			})
		);
		
		await client.query(
			`INSERT INTO "${tableName}" (${columns.map(c => `"${c}"`).join(', ')}) VALUES ${placeholders}`,
			values
		);
	}
	
	private static inferColumns(record: JsonObject): string {
		const typeOf = (key, value) => {
			if (key === '_vector') {
				const dimensions = Array.isArray(value) ? value.length : 0;
				if (!dimensions) throw new Error('Vector field must be a non-empty array');
				
				return `vector(${dimensions})`;
			}
			
			
			if (typeof value === 'number') {
				if (key.endsWith('_id')) return 'BIGINT';
				
				return 'DOUBLE PRECISION';
			}
			
			if (typeof value === 'boolean') return 'BOOLEAN';
			
			return 'TEXT';
		}
		
		return [
			'__id SERIAL PRIMARY KEY',
			...Object.entries(record).map(([key, value]) => `"${key}" ${typeOf(key, value)}`)
		].join(', ');
	}
}
