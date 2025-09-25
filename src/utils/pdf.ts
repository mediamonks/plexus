import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import pdf from 'pdf-parse-debugging-disabled';
import CustomError from '../entities/error-handling/CustomError';

async function getPdfText(filePath: string): Promise<string> {
	const data = await pdf(filePath);
	return data.text;
}

async function* read(filePath: string): AsyncGenerator<{ text: string }> {
	// TODO this should not be part of the PDF util, move to vectordb?
	if (!filePath.endsWith('.pdf')) throw new CustomError(`Error while generating embeddings for ${filePath}: Invalid filetype. Must be PDF.`);
	
	// TODO Add OCR capability for PDF's with mostly text in images
	
	let text;
	try {
		text = await getPdfText(filePath);
	} catch (error) {
		throw new CustomError(`Error while generating embeddings for ${filePath}: Invalid file contents. Must be valid PDF.`);
	}
	
	// TODO make configurable
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
