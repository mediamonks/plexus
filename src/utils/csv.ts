import fs from 'node:fs';
import { parse } from 'csv-parse';
import CustomError from '../entities/error-handling/CustomError';
import { JsonObject } from '../types/common';

async function* read(filePath: string): AsyncGenerator<JsonObject> {
	if (!filePath.toLowerCase().endsWith('.csv')) throw new CustomError(`Error while opening ${filePath}: Invalid filetype. Must be CSV.`);
	
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

export default { read };
