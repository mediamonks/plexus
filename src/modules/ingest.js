const path = require('node:path');
const vectordb = require('./vectordb');
const DataSources = require('./DataSources');
const storage = require('../services/storage');
const pdf = require('../utils/pdf');
const dataSources = require('../../config/data-sources.json');
const llm = require('./llm');
const fs = require('node:fs/promises');
const auth = require('../services/auth')();
const drive = require('../services/drive')(auth);

// TODO add google drive folder or file, storage bucket file url
const retrieve = {
	gcs: ({ namespace, source }) => storage.cacheAll(`sources/${namespace}/${source}`),
	drive: ({ source }) => drive.downloadFolderContents(source)
};

const process = {
	['text:vector']: async function ({ id, files }) {
		const documents = files.filter(name => name.toLowerCase().endsWith('pdf'));
		// TODO error when not PDF?
		
		if (!documents.length) return;
		// TODO error when no files?
		
		await vectordb.drop(id);
		await vectordb.create(id, pdf.readAll(documents));
	},
	
	['text:raw']: async function ({ id, files }) {
		const getText = {
			pdf: async file => await pdf.getPdfText(file),
			txt: async file => (await fs.readFile(file)).toString()
		};
		
		for (const file of files) {
			if (!getText[path.extname(file)]) throw new Error(`Unsupported file type: ${file}`);
			
			const text = await getText[path.extname(file)](file);
			await storage.write(`raw/${id}.txt`, text);
		}
	},
	
	['text:digest']: async function ({ id, files, instructions }) {
		const contents = await Promise.all(files.map(pdf.getPdfText));
		const systemInstructions = (await fs.readFile(await storage.cache(`system-instructions/${instructions}.txt`))).toString();
		
		const digest = await llm.query(contents.join('\n\n'), {
			systemInstructions,
			temperature: 0,
		});
		
		await storage.write(`digest/${id}.txt`, digest);
	},
	
	['data:raw']: async function ({ id, files }) {
		const data = await Promise.all(files.map(file => fs.readFile(file).then(buffer => buffer.toString())));
		await storage.write(`data/${id}.jsonl`, data.join('\n'));
	},
};

async function ingest(id) {
	const { source, type } = dataSources[id];
	
	if (source.startsWith(':')) {
		if (type.split(':')[1] === 'vector') throw new Error('Dynamic source not supported for vector type data sources');
		console.warn(`Not ingesting data source "${id}": dynamic source`);
		return;
	}
	
	await DataSources.write(id, await DataSources.read(id));
}

async function ingestAll(namespace) {
	await Promise.all(Object.keys(dataSources).map(id => {
		if (namespace && dataSources[id].namespace !== namespace) return;
		
		return ingest(id);
	}));
}

module.exports = { ingest, ingestAll };
