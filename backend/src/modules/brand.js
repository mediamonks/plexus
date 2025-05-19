const fs = require('node:fs/promises');
const path = require('node:path');
const vectordb = require('../modules/vectordb');
const storage = require('../services/storage');
const jsonl = require('../utils/jsonl');
const pdf = require('../utils/pdf');
const requestContext = require('../utils/request-context');
const llm = require('./llm');
const brands = require('../../data/fields/brands.json');

const TEMP_PATH = './temp/';

async function createVectorDb(brandId, files) {
	const documents = files.filter(name => name.toLowerCase().endsWith('pdf'));
	
	if (!documents.length) return;
	
	const tableName = `${brandId}-unstructured`;
	await vectordb.drop(tableName);
	await vectordb.create(tableName, pdf.readAll(documents));
}

async function createStructuredVectorDb(brandId, files) {
	const structuredGroundingDocuments = files.filter(name => name.toLowerCase().endsWith('jsonl'));

	if (structuredGroundingDocuments.length) {
		const tableName = `${brandId}-structured`;
		await vectordb.drop(tableName);
		await vectordb.create(tableName, jsonl.readAll(structuredGroundingDocuments));
	}
}

async function createBrandGuidelines(brandId) {
	const groundingPath = path.join(TEMP_PATH, 'grounding', brandId);
	
	const documents = (await fs.readdir(groundingPath))
		.filter(name => name.toLowerCase().endsWith('pdf'))
		.map(name => path.join(groundingPath, name))
		.sort();
	
	const input = await Promise.all(documents.map(file => pdf.getPdfText(file)));
	const brand = brands[brandId].label;
	const systemInstructions = (await fs.readFile('./data/brand-guidelines-prompt.txt')).toString().replace(/\{\{\$brand}}/g, brand);
	const brandGuidelines = await llm.query(input.join('\n'), { systemInstructions, temperature: 0 });
	
	await fs.writeFile(path.join(groundingPath, 'brand-guidelines.txt'), brandGuidelines);
	await storage.write(`grounding/${brandId}/brand-guidelines.txt`, brandGuidelines);
}

async function setup(brandId, config) {
	await requestContext.run({ config }, async () => {
		const groundingPath = `grounding/${brandId}`;
		const files = await storage.cacheAll(groundingPath);
		
		await Promise.all([
			// createVectorDb(brandId, files),
			createBrandGuidelines(brandId, files),
		]);
	});
}

module.exports = { setup };
