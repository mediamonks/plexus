import fs from 'node:fs';
import readline from 'node:readline/promises';
import CustomError from '../entities/error-handling/CustomError';
import { JsonArray, JsonObject, SOURCE_FORMAT, DataItemGenerator } from '../types/common';

function read(filePath: string): DataItemGenerator<JsonObject> {
	if (!filePath.toLowerCase().endsWith('.jsonl')) throw new CustomError(`Error while opening ${filePath}: Invalid filetype. Must be JSONL.`);
	
	async function* generator(): AsyncGenerator<JsonObject> {
		const rl = readline.createInterface({
			input: fs.createReadStream(filePath),
			crlfDelay: Infinity
		});
		
		for await (const line of rl) {
			let data: JsonObject;
			try {
				data = JSON.parse(line);
			} catch (error) {
				throw new CustomError(`Error while reading ${filePath}: Invalid file contents. Must be valid JSONL.`);
			}
			yield data;
		}
	}
	
	const gen = generator() as DataItemGenerator<JsonObject>;
	gen[SOURCE_FORMAT] = 'jsonl';
	return gen;
}

function readAll(filePaths: string[]): DataItemGenerator<JsonObject> {
	async function* generator(): AsyncGenerator<JsonObject> {
		for await (const filePath of filePaths) {
			for await (const data of read(filePath)) yield data;
		}
	}
	
	const gen = generator() as DataItemGenerator<JsonObject>;
	gen[SOURCE_FORMAT] = 'jsonl';
	return gen;
}

async function parse(data: string): Promise<JsonArray> {
	return data.split(/\n+/).map(line => JSON.parse(line));
}

export default { read, readAll, parse };
