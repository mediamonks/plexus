const { performance } = require('node:perf_hooks');
const lancedb = require('@lancedb/lancedb');
const config = require('../utils/config');

// const lancedbConfig = require('../../config/lancedb.json');
const lancedbConfig = config.get('lancedb');

let _db;
const db = async () => _db ??= await lancedb.connect(lancedbConfig.databaseUri);
const _tables = {};
const RATE_LIMIT_DELAY_MS = lancedbConfig.rateLimitDelayMs ?? 0;
const lastTableWrites = {};
const tableRecordBuffers = {};
const tableWriteTimeouts = {};

async function getTable(name) {
	_tables[name] ??= db().then(database => database.openTable(name));
	
	return _tables[name];
}

async function dropTable(name) {
	const database = await db();
	
	const tableNames = await database.tableNames();
	if (tableNames.includes(name)) {
		await database.dropTable(name);
	}
}

async function createTable(name, records, schema) {
	const database = await db();
	
	lastTableWrites[name] = performance.now();
	if (schema) {
		_tables[name] = await database.createEmptyTable(name, schema);
		await append(name, records);
	} else {
		await database.createTable(name, records);
	}
}

async function writeRecordBuffer(tableName) {
	lastTableWrites[tableName] = performance.now();
	delete tableWriteTimeouts[tableName];
	if (!tableRecordBuffers[tableName]) return;
	const table = await getTable(tableName);
	await table.add(tableRecordBuffers[tableName]);
	delete tableRecordBuffers[tableName];
}

async function append(tableName, records) {
	if (!records.length) return;
	
	tableRecordBuffers[tableName] ??= [];
	tableRecordBuffers[tableName].push(...records);
	tableWriteTimeouts[tableName] ??= new Promise(resolve => setTimeout(
		() => writeRecordBuffer(tableName).then(resolve),
		Math.max(0, (lastTableWrites[tableName] ?? 0) + RATE_LIMIT_DELAY_MS - performance.now())
	));
	
	return tableWriteTimeouts[tableName];
}

async function upsert(tableName, records) {
	const table = await getTable(tableName);
	await table.mergeInsert('id')
		.whenMatchedUpdateAll()
		.whenNotMatchedInsertAll()
		.execute(records);
}

async function search(tableName, embeddings, { limit = 3, filter, fields }) {
	const table = await getTable(tableName);
	
	let vectorQuery = await table.vectorSearch(embeddings);
	
	if (fields) vectorQuery = vectorQuery.select(fields);
	
	if (filter) vectorQuery = vectorQuery.where(
		Object.keys(filter).map(key => `${key} = '${filter[key]}'`).join(' AND ')
	);
	
	const results = await vectorQuery
		.distanceType('cosine')
		.limit(limit)
		.toArray()
	
	const resultArray = [];
	for await(const item of results) resultArray.push(item);
	
	return resultArray;
}

async function ensureTableExists(name, schema) {
	if (_tables[name]) return;
	
	const database = await db();
	try {
		_tables[name] = await database.openTable(name);
	} catch (error) {
		lastTableWrites[name] = performance.now();
		_tables[name] = await database.createEmptyTable(name, schema);
	}
}

module.exports = { createTable, append, search, ensureTableExists, dropTable };
