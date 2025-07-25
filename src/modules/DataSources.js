const fs = require('node:fs/promises');
const path = require('node:path');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const llm = require('./llm');
const vectordb = require('./vectordb');
const auth = require('../services/auth')();
const drive = require('../services/drive')(auth);
const docs = require('../services/docs')(auth);
const sheets = require('../services/sheets')(auth);
const storage = require('../services/storage');
const jsonl = require('../utils/jsonl');
const pdf = require('../utils/pdf');
const Profiler = require('../utils/Profiler');
const requestContext = require('../utils/request-context');
const UnsupportedError = require('../utils/UnsupportedError');
const xlsx = require('../utils/xlsx');
const dataSources = require('../../config/data-sources.json');

// TODO improve error handling for non-existent Drive IDs and GCS paths

async function sourceToSources({ source, platform, namespace, folder }) {
	const mapping = {
		gcs: async () => {
			const path = `sources/${namespace}/${source}`;
			const isFolder = folder ?? await storage.isFolder(path);
			if (isFolder) return await storage.list(path);
			return [path];
		},
		drive: async () => {
			const isFolder = folder ?? await drive.isFolder(source);
			if (isFolder) return drive.listFolderContents(source);
			return [await drive.getFileMetadata(source)];
		}
	};
	
	return mapping[platform]();
}

async function fileToText(file) {
	const getText = {
		pdf: async file => await pdf.getPdfText(file),
		txt: async file => (await fs.readFile(file)).toString()
	};
	
	const extension = path.extname(file).substring(1);
	
	if (!getText[extension]) throw new UnsupportedError('file type', extension, getText);
	
	return await getText[extension](file);
}

async function gdriveToText(metadata, allowCache) {
	if (metadata.mimeType === 'application/vnd.google-apps.document') return await docs.getMarkdown(metadata.id);
	
	const file = await (allowCache ?? true ? drive.cacheFile(metadata) : drive.downloadFile(metadata));
	
	if (metadata.mimeType === 'application/pdf') return await pdf.getPdfText(file);
	
	if (metadata.mimeType === 'text/plain') return (await fs.readFile(file)).toString();
}

async function gdriveToData(metadata, allowCache) {
	if (metadata.mimeType === 'application/vnd.google-apps.spreadsheet') return await sheets.getData(metadata.id);
	
	const file = await (allowCache ?? true ? drive.cacheFile(metadata) : drive.downloadFile(metadata));
	
	if (metadata.mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') return await xlsx.getData(file);
}

function detectDataType(platform, source) {
	const TYPES = {
		GCS: {
			'pdf': 'text',
			'txt': 'text',
			'jsonl': 'data',
		},
		DRIVE: {
			'application/vnd.google-apps.document': 'text',
			'application/pdf': 'text',
			'text/plain': 'text',
			'application/vnd.google-apps.spreadsheet': 'data',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'data',
		}
	};
	
	if (platform === 'gcs') return TYPES.GCS[path.extname(source).substring(1)];
	if (platform === 'drive') return TYPES.DRIVE[source.mimeType];
}

async function sourceToContent({ source, platform, dataType, cache }) {
	return await {
		gcs: {
			text: async path => fileToText(await storage.cache(path)),
			data: async path => jsonl.read(await storage.cache(path)),
		},
		drive: {
			text: metadata => gdriveToText(metadata, cache),
			data: metadata => gdriveToData(metadata, cache),
		}
	}[platform][dataType](source);
}

// async function filesToText(files) {
// 	return (await Promise.all(files.map(fileToText))).join('\n\n');
// }

async function* textToChunks(text) {
	const splitter = new RecursiveCharacterTextSplitter({
		chunkSize: 500,
		chunkOverlap: 200,
	});
	
	const chunks = await splitter.createDocuments([text]);
	
	for (const chunk of chunks) {
		const text = chunk.pageContent;
		if (!text) continue;
		yield text;
	}
}

async function* chunksToRecords(chunks) {
	for await (const chunk of chunks) yield { text: chunk, vector: await vectordb.generateDocumentEmbeddings(chunk) };
}

async function textToDigest(text, instructions) {
	const systemInstructions = (await fs.readFile(await storage.cache(`system-instructions/${instructions}.txt`))).toString();
	
	return await llm.query(text, {
		systemInstructions,
		temperature: 0,
	});
}

// async function* filesToData(files) {
// 	for await (const file of files) yield jsonl.read(file);
// }

async function* dataToRecords(data) {
	for await (const record of data) yield { ...record, vector: await vectordb.generateDocumentEmbeddings(record) };
}

async function contentsToTarget({ contents, dataType, target, instructions }) {
	if (dataType === 'text') {
		if (target === 'raw') return contents.join('\n\n');
		if (target === 'digest') return await textToDigest(contents.join('\n\n'), instructions);
		if (target === 'vector') {
			return (async function* () {
				for await (const text of contents) yield* chunksToRecords(textToChunks(text));
			})();
		}
	}
	
	if (dataType === 'data') {
		if (target === 'raw') return contents.flat();
		if (target === 'profile') throw new Error('Not implemented');
		if (target === 'vector') {
			return (async function* () {
				for await (const data of contents) yield* dataToRecords(data);
			})();
		}
	}
}

module.exports = class DataSources {
	static get catalog() {
		return requestContext.get().catalog;
	}
	
	static async mapSource(source) {
		if (source.startsWith(':')) return await this.catalog.get(source.substring(1));
		return source;
	}
	
	static async read(id) {
		let { namespace, source, platform, type, instructions, folder, cache } = dataSources[id];
		
		let [ dataType, target ] = type.split(':');
		
		source = await this.mapSource(source);
		
		const sources = await Profiler.run(() => sourceToSources({ source, platform, namespace, folder }), `sourceToSources(${id})`);
		
		if (!sources.length) throw new Error(`Datasource "${id}" contains no files`);
		
		if (!dataType) {
			for (const source of sources) {
				const detectedType = detectDataType(platform, source);
				if (!detectedType) throw new Error(`Unable to detect data type for datasource "${id}"`);
				if (!dataType) dataType = detectedType;
				else if (dataType !== detectedType) throw new Error(`Datasource "${id}" contains multiple data types`);
			}
		}
		
		const contents = await Promise.all(
			sources.map(
				async source => Profiler.run(() => sourceToContent({
					source,
					platform,
					dataType: dataType || detectDataType(platform, source),
					cache
				}), `sourceToContent(${source.name ?? source})`)
			)
		);
		
		return Profiler.run(() => contentsToTarget({ contents, dataType, target, instructions }), `contentsToTarget(${id})`);
	}
	
	static async write(id, data) {
		const { type } = dataSources[id];
		
		// TODO account for ":raw" etc, detected input type
		const mapping = {
			'text:raw': async () => await storage.write(`text/${id}.txt`, data),
			'text:digest': async () => await storage.write(`text/${id}.txt`, data),
			'text:vector': async () => {
				// TODO support incremental
				await vectordb.drop(id);
				await vectordb.create(id, data);
			},
			'data:raw': async () => await storage.write(`data/${id}.jsonl`, data.join('\n')),
			'data:profile': () => new Error('Not implemented'),
			'data:vector': () => async () => {
				// TODO support incremental
				await vectordb.drop(id);
				await vectordb.create(id, data);
			},
		};
		
		if (!mapping[type]) throw new UnsupportedError('data source type', type, mapping);
		
		return mapping[type]();
	}
	
	static async get(id) {
		// TODO prevent double reads / race conditions by caching read promise
		const { source, type } = dataSources[id];
		
		if (source.startsWith(':')) return this.read(id);
		
		const mapping = {
			text: async () => {
				const localPath = await storage.cache(`text/${id}.txt`);
				const buffer = await fs.readFile(localPath);
				return buffer.toString();
			},
			data: async () => jsonl.read(await storage.cache(`data/${id}.jsonl`)),
		};
		
		const dataType = type.split(':')[0];
		
		if (!mapping[dataType]) throw new UnsupportedError('data source type', type, mapping);
		
		return mapping[dataType]();
	}
};
