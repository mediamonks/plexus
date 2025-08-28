import fs from 'node:fs';
import readline from 'node:readline/promises';

async function* read(filePath: string): AsyncGenerator<any> {
	if (!filePath.toLowerCase().endsWith('.jsonl')) throw new Error(`Error while opening ${filePath}: Invalid filetype. Must be JSONL.`);
	
	const rl = readline.createInterface({
		input: fs.createReadStream(filePath),
		crlfDelay: Infinity
	});
	
	for await (const line of rl) {
		let data;
		try {
			data = JSON.parse(line);
		} catch (error) {
			throw new Error(`Error while reading ${filePath}: Invalid file contents. Must be valid JSONL.`);
		}
		yield data;
	}
}

async function* readAll(filePaths: string[]): AsyncGenerator<any> {
	for await (const filePath of filePaths) {
		for await (const data of read(filePath)) yield data;
	}
}

async function parse(data: string): Promise<any[]> {
	return data.split(/\n+/).map(line => JSON.parse(line));
}

export default { read, readAll, parse };
