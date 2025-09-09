import azure from '../services/azure';
import openai from '../services/openai';
import genai from '../services/genai';
import lancedb from '../services/lancedb';
import config from '../utils/config';
import Profiler from '../utils/Profiler';
import { JsonObject } from '../types/common';
import embeddingModels from '../../data/embedding-models.json';

const EMBEDDING_PLATFORMS = {
	azure,
	openai,
	google: genai,
};

const _embeddings = {};

async function generateEmbeddings(text: string, { forDocument = false }: { forDocument?: boolean } = {}): Promise<number[]> {
	if (!text) throw new Error('Error: No text provided when generating embeddings');
	
	const platform = getEmbeddingPlatform();
	
	const cachedEmbeddings = _embeddings?.[platform]?.[text];
	
	if (cachedEmbeddings) return cachedEmbeddings;
	
	const embeddings = Profiler.run(forDocument
			? EMBEDDING_PLATFORMS[platform].generateDocumentEmbeddings
			: EMBEDDING_PLATFORMS[platform].generateQueryEmbeddings,
		[text]) as number[];
	
	_embeddings[platform] ??= {};
	_embeddings[platform][text] ??= embeddings;
	
	return embeddings;
}

async function generateDocumentEmbeddings(text: string): Promise<number[]> {
	return await generateEmbeddings(text, { forDocument: true });
}

async function append(tableName: string, source: AsyncIterable<any>, searchField: string = 'text', { schema }: { schema?: any } = {}): Promise<void> {
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

async function create(tableName: string, source: AsyncGenerator<JsonObject>, { schema }: { schema?: any } = {}): Promise<void> {
	const promises = [];
	let dimensions, tableCreated, internalTableName;
	
	for await (const data of source) {
		promises.push((async () => {
			if (dimensions) {
				await tableCreated;
				return lancedb.append(internalTableName, [data]);
			}
			
			dimensions = (data.vector as number[]).length;
			internalTableName = getTableName(tableName, dimensions);
			tableCreated = schema
				? createEmpty(internalTableName, schema).then(() => lancedb.append(internalTableName, [data]))
				: lancedb.createTable(internalTableName, [data], schema);
			
			return tableCreated;
		})());
	}
	
	await Promise.all(promises);
}

async function createEmpty(tableName: string, schema: any): Promise<void> {
	schema.fields.find(field => field.name === 'vector').type.listSize = getDimensions();
	await lancedb.createTable(getTableName(tableName), [], schema);
}

async function search(tableName: string, embeddings: number[], { limit, filter, fields }: { limit?: number; filter?: any; fields?: string[] } = {}): Promise<JsonObject[]> {
	return await Profiler.run(() => lancedb.search(getTableName(tableName), embeddings, { limit, filter, fields }), `vectordb search ${tableName}`);
}

function getEmbeddingPlatform(): string {
	const embeddingPlatform = config.get('embeddingPlatform') as string;
	
	if (!EMBEDDING_PLATFORMS[embeddingPlatform]) throw new Error(`Invalid embedding platform selection: "${embeddingPlatform}". Must be one of: ${Object.keys(EMBEDDING_PLATFORMS).join(', ')}`);
	
	return embeddingPlatform;
}

function getTableName(tableName: string, dimensions?: number): string {
	return `${tableName}-${dimensions ?? getDimensions()}`;
}

function getDimensions(): number {
	const embeddingPlatform = getEmbeddingPlatform();
	if (!embeddingModels[EMBEDDING_PLATFORMS[embeddingPlatform].config.embeddingModel]) throw new Error('Error: Unsupported embedding model');
	return embeddingModels[EMBEDDING_PLATFORMS[embeddingPlatform].config.embeddingModel].dimensions;
}

async function ensureTableExists(tableName: string, schema: any): Promise<any> {
	schema.fields.find(field => field.name === 'vector').type.listSize = getDimensions();
	return lancedb.ensureTableExists(getTableName(tableName), schema);
}

async function ingest(tableName: string, source: AsyncIterable<any>, searchField: string = 'text', { excludeSearchField }: { excludeSearchField?: boolean } = {}): Promise<void> {
	const promises = [];
	let dimensions;
	
	for await (const data of source) {
		if (!data[searchField]) continue;
		
		promises.push((async () => {
			const vector = await generateEmbeddings(data[searchField], { forDocument: true });
			
			if (excludeSearchField) delete data[searchField];
			
			const record = { ...data, vector };
			
			dimensions = vector.length;

			return lancedb.append(getTableName(tableName, dimensions), [record]);
		})());
	}
	
	await Promise.all(promises);
}

async function drop(tableName: string): Promise<any> {
	return lancedb.dropTable(getTableName(tableName));
}

export default {
	generateQueryEmbeddings: generateEmbeddings,
	generateDocumentEmbeddings,
	create,
	search,
	append,
	ingest,
	drop,
	ensureTableExists,
};
