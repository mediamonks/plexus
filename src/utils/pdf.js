const pdf = require('pdf-parse');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const fs = require('node:fs');

async function getPdfText(filePath) {
	const data = await pdf(await fs.promises.readFile(filePath));
	return data.text;
}

async function* read(filePath) {
	if (!filePath.endsWith('.pdf')) throw new Error(`Error while generating embeddings for ${filePath}: Invalid filetype. Must be PDF.`);
	
	// TODO Add OCR capability for PDF's with mostly text in images
	
	let text;
	try {
		text = await getPdfText(filePath);
	} catch (error) {
		throw new Error(`Error while generating embeddings for ${filePath}: Invalid file contents. Must be valid PDF.`);
	}
	
	const splitter = new RecursiveCharacterTextSplitter({
		chunkSize: 500,
		chunkOverlap: 200,
	});
	
	const chunks = await splitter.createDocuments([text]);
	
	for (const chunk of chunks) {
		const text = chunk.pageContent;
		if (!text) continue;
		yield { text };
	}
}

async function* readAll(filePaths) {
	for await (const filePath of filePaths) {
		for await (const data of read(filePath)) yield data;
	}
}

module.exports = { getPdfText, read, readAll };
