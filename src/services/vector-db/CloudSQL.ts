import pg from 'pg';
import { Connector, IpAddressTypes, AuthTypes } from '@google-cloud/cloud-sql-connector';
import * as chrono from 'chrono-node';
import IVectorDBEngine from './IVectorDBEngine';
import GoogleAuthClient from '../google-drive/GoogleAuthClient';
import Config from '../../core/Config';
import Profiler from '../../core/Profiler';
import { JsonObject, JsonPrimitive, SchemaProperty, staticImplements } from '../../types/common';

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
		const buffer: JsonObject[] = [];
		const fieldTypes = new Map<string, string>();
		let allFields: string[];
		
		while (true) {
			const { value, done } = await records.next();
			if (done) break;
			
			buffer.push(value);
			allFields ??= Object.keys(value);
			
			for (const [key, val] of Object.entries(value)) {
				if (!fieldTypes.has(key) && this.isValidValue(val)) {
					const type = this.inferFieldType(key, val);
					if (type) fieldTypes.set(key, type);
				}
			}
			
			if (fieldTypes.size === allFields.length) break;
		}
		
		if (buffer.length === 0) return;
		
		const columns = this.buildColumnsFromTypes(fieldTypes);
		const client = await this.getClient();
		await client.query(`CREATE TABLE "${name}" (${columns})`);
		
		await this.executeBatchInsert(name, buffer);
		
		await this.append(name, records);
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
		
		if (batch.length > 0) await this.executeBatchInsert(tableName, batch);
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
	
	public static readonly toolCallQuerySchema: SchemaProperty = {
		type: 'string' as const,
		description: 'PostgreSQL query string. Use PostgreSQL syntax only (NOT SQLite).',
	};
	
	public static async getSchema(tableName: string): Promise<string> {
		const columns = await this.getColumnTypes(tableName);
		return columns
			.map(({ column_name, data_type, is_nullable }) => `${column_name} ${data_type} ${is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`)
			.join(', ');
	}
	
	private static async getColumnTypes(tableName: string): Promise<{ column_name: string; data_type: string; is_nullable: string }[]> {
		const client = await this.getClient();
		const result = await client.query(
			`SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = $1`,
			[tableName]
		);
		return result.rows;
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
	
	private static isValidValue(value: unknown): boolean {
		return value !== null && value !== undefined && value !== '';
	}
	
	private static async executeBatchInsert(tableName: string, records: JsonObject[]): Promise<void> {
		if (records.length === 0) return;
		
		const client = await this.getClient();
		const columnTypes = await this.getColumnTypes(tableName);
		const columnNames = columnTypes
			.map(c => c.column_name)
			.filter(name => name !== '__id');
		
		const placeholders = records.map((_, recordIndex) =>
			`(${columnNames.map((_, columnIndex) => `$${recordIndex * columnNames.length + columnIndex + 1}`).join(', ')})`
		).join(', ');
		
		const values = records.flatMap(record =>
			columnNames.map(columnName => {
				let val = record[columnName];
				
				if (columnName === '_vector' && Array.isArray(val)) return JSON.stringify(val);
				
				const columnType = columnTypes.find(({ column_name }) => column_name === columnName)?.data_type;
				
				if (typeof val === 'string' && val.trim() === '' && columnType !== 'text') {
					return null;
				}
				
				if (columnType?.includes('timestamp') && typeof val === 'string') {
					return this.parseDate(val);
				}
				
				return val ?? null;
			})
		);
		
		await client.query(
			`INSERT INTO "${tableName}" (${columnNames.map(c => `"${c}"`).join(', ')}) VALUES ${placeholders}`,
			values
		);
	}
	
	private static parseDate(dateString: string): string | null {
		if (!dateString || !dateString.trim()) return null;
		const parsed = chrono.parseDate(dateString);
		return parsed ? parsed.toISOString() : null;
	}
	
	private static inferFieldType(key: string, value: unknown): string | null {
		if (value === null || value === undefined) return null;
		
		if (key === '_vector') {
			const dimensions = Array.isArray(value) ? value.length : 0;
			if (!dimensions) throw new Error('Vector field must be a non-empty array');
			
			return `vector(${dimensions})`;
		}
		
		if (typeof value === 'number') {
			if (Number.isInteger(value)) return 'BIGINT';
			return 'DOUBLE PRECISION';
		}
		
		if (typeof value === 'boolean') return 'BOOLEAN';
		
		if (typeof value === 'string') {
			const trimmed = value.trim();
			
			if (!trimmed) return null;
			
			if (trimmed.toLowerCase() === 'true' || trimmed.toLowerCase() === 'false') {
				return 'BOOLEAN';
			}
			
			if (!isNaN(Number(trimmed))) {
				const num = Number(trimmed);
				if (Number.isInteger(num)) return 'BIGINT';
				return 'DOUBLE PRECISION';
			}
			
			if (/\bdate(time)?\b/i.test(key)) return 'TIMESTAMP';
			
			if (chrono.parseDate(trimmed)) return 'TIMESTAMP';
		}
		
		return 'TEXT';
	}
	
	private static buildColumnsFromTypes(fieldTypes: Map<string, string>): string {
		return [
			'__id SERIAL PRIMARY KEY',
			...Array.from(fieldTypes.entries()).map(([key, type]) => `"${key}" ${type}`)
		].join(', ');
	}
}
