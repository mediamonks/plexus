import { performance } from 'node:perf_hooks';
import lancedb, { Connection } from '@lancedb/lancedb';
import Config from '../core/Config';
import { JsonObject } from '../types/common';

type Configuration = {
	databaseUri: string;
	rateLimitDelayMs?: number;
};

let _db: Connection;
const db = async () => {
	if (_db) return _db;
	const databaseUri = Config.get('lancedb/databaseUri') as Configuration['databaseUri'];
	_db = await lancedb.connect(databaseUri);
	return _db;
}
const _tables = {};
const lastTableWrites = {};
const tableRecordBuffers = {};
const tableWriteTimeouts = {};

async function getTable(name: string): Promise<any> {
	_tables[name] ??= db().then(database => database.openTable(name));
	
	return _tables[name];
}

async function dropTable(name: string): Promise<void> {
	const database = await db();
	
	const tableNames = await database.tableNames();
	if (tableNames.includes(name)) {
		await database.dropTable(name);
	}
}

async function createTable(name: string, records: any[], schema?: any): Promise<void> {
	const database = await db();
	
	lastTableWrites[name] = performance.now();
	if (schema) {
		_tables[name] = await database.createEmptyTable(name, schema);
		await append(name, records);
	} else {
		await database.createTable(name, records);
	}
}

async function writeRecordBuffer(tableName: string): Promise<void> {
	lastTableWrites[tableName] = performance.now();
	delete tableWriteTimeouts[tableName];
	if (!tableRecordBuffers[tableName]) return;
	const table = await getTable(tableName);
	await table.add(tableRecordBuffers[tableName]);
	delete tableRecordBuffers[tableName];
}

async function append(tableName: string, records: any[]): Promise<any> {
	if (!records.length) return;
	
	const rateLimitDelay = Config.get('lancedb/rateLimitDelayMs') as Configuration['rateLimitDelayMs'];
	
	tableRecordBuffers[tableName] ??= [];
	tableRecordBuffers[tableName].push(...records);
	tableWriteTimeouts[tableName] ??= new Promise(resolve => setTimeout(
		() => writeRecordBuffer(tableName).then(resolve),
		Math.max(0, (lastTableWrites[tableName] ?? 0) + rateLimitDelay - performance.now())
	));
	
	return tableWriteTimeouts[tableName];
}

async function upsert(tableName: string, records: any[]): Promise<void> {
	const table = await getTable(tableName);
	await table.mergeInsert('id')
		.whenMatchedUpdateAll()
		.whenNotMatchedInsertAll()
		.execute(records);
}

async function search(tableName: string, embeddings: number[], { limit = 3, filter, fields }: { limit?: number; filter?: any; fields?: string[] }): Promise<JsonObject[]> {
	const table = await getTable(tableName);
	
	let vectorQuery = await table.vectorSearch(embeddings);
	
	if (fields) vectorQuery = vectorQuery.select(fields);
	
	if (filter) vectorQuery = vectorQuery.where(
		Object.keys(filter).map(key => `${key} = '${filter[key]}'`).join(' AND ')
	);
	
	return await vectorQuery
		.distanceType('cosine')
		.limit(limit)
		.toArray();
}

async function ensureTableExists(name: string, schema: any): Promise<void> {
	if (_tables[name]) return;
	
	const database = await db();
	try {
		_tables[name] = await database.openTable(name);
	} catch (error) {
		lastTableWrites[name] = performance.now();
		_tables[name] = await database.createEmptyTable(name, schema);
	}
}

export default { createTable, append, search, ensureTableExists, dropTable };
