const fs = require('node:fs/promises');
const path = require('node:path');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const llm = require('./llm');
const vectordb = require('./vectordb');
const auth = require('../services/auth')();
const drive = require('../services/drive')(auth);
const storage = require('../services/storage');
const jsonl = require('../utils/jsonl');
const pdf = require('../utils/pdf');
const requestContext = require('../utils/request-context');
const dataSources = require('../../config/data-sources.json');
const UnsupportedError = require('../utils/UnsupportedError');

async function fileToText(file) {
	const getText = {
		pdf: async file => await pdf.getPdfText(file),
		txt: async file => (await fs.readFile(file)).toString()
	};
	
	const extension = path.extname(file).substring(1);
	
	if (!getText[extension]) throw new UnsupportedError('file type', extension, getText);
	
	return await getText[extension](file);
}

async function filesToText(files) {
	return (await Promise.all(files.map(fileToText))).join('\n\n');
}

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

async function* filesToData(files) {
	for await (const file of files) yield jsonl.read(file);
}

async function* dataToRecords(data) {
	for await (const record of data) yield { ...record, vector: await vectordb.generateDocumentEmbeddings(record) };
}

module.exports = class DataSources {
	static get catalog() {
		return requestContext.get().catalog;
	}
	
	static async read(id) {
		let { namespace, source, platform, type, instructions } = dataSources[id];
		
		if (source.startsWith(':')) source = await this.catalog.get(source.substring(1));
		
		const retrieve = {
			gcs: async () => {
				const path = `sources/${namespace}/${source}`;
				if (await storage.isFolder(path)) return await storage.cacheAll(path);
				else return [await storage.cache(path)];
			},
			drive: async () => await drive.isFolder(source)
					? drive.downloadFolderContents(source)
					: drive.downloadFile(await drive.getFileMetadata(source)), // TODO use local caching similar to gcs. or not?
		};
		
		const files = await retrieve[platform]({ namespace, source });
		
		if (!files.length) throw new Error(`Datasource "${id}" contains no files`);
		
		//TODO support GDrive sheet to data
		const mapping = {
			'text:raw': async () => await filesToText(files),
			'text:digest': async () => await textToDigest(await filesToText(files), instructions),
			'text:vector': async () => chunksToRecords(textToChunks(await filesToText(files))),
			'data:raw': async () => (await Promise.all(files.map(filesToData))).join('\n'),
			'data:profile': () => new Error('Not implemented'),
			'data:vector': async () => dataToRecords(filesToData(files)),
		};
		
		if (!mapping[type]) throw new UnsupportedError('data source type', type, mapping);
		
		return mapping[type]();
	}
	
	static async write(id, data) {
		const { type } = dataSources[id];
		
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
