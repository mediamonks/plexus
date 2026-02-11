import fs from 'node:fs';
import { parse } from 'csv-parse';
import CustomError from '../entities/error-handling/CustomError';
import { JsonObject, SOURCE_FORMAT, DataItemGenerator } from '../types/common';

function read(filePath: string): DataItemGenerator<JsonObject> {
	if (!filePath.toLowerCase().endsWith('.csv')) throw new CustomError(`Error while opening ${filePath}: Invalid filetype. Must be CSV.`);
	
	async function* generator(): AsyncGenerator<JsonObject> {
		const parser = fs.createReadStream(filePath).pipe(
			parse({
				columns: true,
				skip_empty_lines: true,
				trim: true,
				relax_quotes: true
			})
		);
		
		for await (const record of parser) {
			yield record as JsonObject;
		}
	}
	
	const gen = generator() as DataItemGenerator<JsonObject>;
	gen[SOURCE_FORMAT] = 'csv';
	return gen;
}

export default { read };
