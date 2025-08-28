import fs from 'node:fs';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

async function getPdfText(filePath: string): Promise<string> {
	const pdf = (await import('pdf-parse')).default;
	const data = await pdf(await fs.promises.readFile(filePath));
	return data.text;
}

async function* read(filePath: string): AsyncGenerator<{ text: string }> {
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

async function* readAll(filePaths: string[]): AsyncGenerator<{ text: string }> {
	for await (const filePath of filePaths) {
		for await (const data of read(filePath)) yield data;
	}
}

export default { getPdfText, read, readAll };
