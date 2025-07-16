const embeddingPlatforms = {
	google: require('../services/vertexai'),
}
const lancedb = require('../services/lancedb');
const config = require('../utils/config');
const Profiler = require('../utils/Profiler');
const embeddingModels = require('../../data/embedding-models.json');

const _embeddings = {};

async function generateEmbeddings(text, { forDocument = false } = {}) {
	if (!text) throw new Error('Error: No text provided when generating embeddings');
	
	const platform = getEmbeddingPlatform();
	
	const cachedEmbeddings = _embeddings?.[platform]?.[text];
	
	if (cachedEmbeddings) return cachedEmbeddings;
	
	const embeddings = Profiler.run(forDocument
			? embeddingPlatforms[platform].generateDocumentEmbeddings
			: embeddingPlatforms[platform].generateQueryEmbeddings,
		[text]);
	
	_embeddings[platform] ??= {};
	_embeddings[platform][text] ??= embeddings;
	
	return embeddings;
}

async function generateDocumentEmbeddings(text) {
	return await generateEmbeddings(text, { forDocument: true });
}

async function append(tableName, source, searchField = 'text', { schema } = {}) {
	const promises = [];
	let internalTableName;
	
	for await (const data of source) {
		if (!data[searchField]) continue;
		
		promises.push((async () => {
			try {
				const vector = await generateEmbeddings(data[searchField], { forDocument: true });
				const record = { ...data, vector };
				
				internalTableName ??= getTableName(tableName, vector.length);
				
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

async function create(tableName, source, { schema } = {}) {
	const promises = [];
	let dimensions, tableCreated, internalTableName;
	
	for await (const data of source) {
		promises.push((async () => {
			if (dimensions) {
				await tableCreated;
				return lancedb.append(internalTableName, [data]);
			}
			
			dimensions = data.vector.length;
			internalTableName = getTableName(tableName, dimensions);
			tableCreated = schema
				? createEmpty(internalTableName, schema).then(() => lancedb.append(internalTableName, [data]))
				: lancedb.createTable(internalTableName, [data], schema);
			
			return tableCreated;
		})());
	}
	
	await Promise.all(promises);
}

async function createEmpty(tableName, schema) {
	schema.fields.find(field => field.name === 'vector').type.listSize = getDimensions();
	await lancedb.createTable(getTableName(tableName), [], schema);
}

async function search(tableName, embeddings, { limit, filter, fields } = {}) {
	return await Profiler.run(() => lancedb.search(getTableName(tableName), embeddings, { limit, filter, fields }), `vectordb search ${tableName}`);
}

function getEmbeddingPlatform() {
	const embeddingPlatform = config.get('embeddingPlatform');
	
	if (!embeddingPlatforms[embeddingPlatform]) throw new Error(`Invalid embedding platform selection: "${embeddingPlatform}". Must be one of: ${Object.keys(embeddingPlatforms).join(', ')}`);
	
	return embeddingPlatform;
}

function getTableName(tableName, dimensions) {
	return `${tableName}-${dimensions ?? getDimensions()}`;
}

function getDimensions() {
	const embeddingPlatform = getEmbeddingPlatform();
	if (!embeddingModels[embeddingPlatforms[embeddingPlatform].config.embeddingModel]) throw new Error('Error: Unsupported embedding model');
	return embeddingModels[embeddingPlatforms[embeddingPlatform].config.embeddingModel].dimensions;
}

async function ensureTableExists(tableName, schema) {
	schema.fields.find(field => field.name === 'vector').type.listSize = getDimensions();
	return lancedb.ensureTableExists(getTableName(tableName), schema);
}

async function ingest(tableName, source, searchField = 'text', { schema, excludeSearchField } = {}) {
	const promises = [];
	let dimensions;
	
	for await (const data of source) {
		if (!data[searchField]) continue;
		
		promises.push((async () => {
			const vector = await generateEmbeddings(data[searchField], { forDocument: true });
			
			if (excludeSearchField) delete data[searchField];
			
			const record = { ...data, vector };
			
			dimensions = vector.length;
			return lancedb.append(getTableName(tableName, dimensions), [record], schema);
		})());
	}
	
	await Promise.all(promises);
}

async function drop(tableName) {
	return lancedb.dropTable(getTableName(tableName));
}

module.exports = {
	generateQueryEmbeddings: generateEmbeddings,
	generateDocumentEmbeddings,
	create,
	search,
	append,
	ingest,
	drop,
	ensureTableExists,
};
