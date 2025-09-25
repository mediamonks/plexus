import TargetDataSourceBehavior from './TargetDataSourceBehavior';
import StructuredDataSourceBehavior from '../data-type/StructuredDataSourceBehavior';
import Catalog from '../../catalog/Catalog';
import CustomError from '../../error-handling/CustomError';
import { JsonArray, JsonObject } from '../../../types/common';

export default class RawDataTargetDataSourceBehavior extends TargetDataSourceBehavior {
	public async read(): Promise<AsyncGenerator<JsonObject>> {
		const contents = await this.dataSource.getContents() as AsyncGenerator<JsonObject>[];
		
		// if (!contents[0][0]) throw new CustomError('Unsupported input data for raw data target data source: must be JSONL');
		
		return (async function* () {
			for (const generator of contents) {
				yield* generator;
			}
		})();
	}
	
	public async query({ filter, limit, fields, sort }: typeof StructuredDataSourceBehavior.QueryParameters = {}): Promise<JsonArray> {
		const data = await this.getData() as AsyncGenerator<JsonObject>;
		
		if (!filter && !limit && !fields && !sort) return await Array.fromAsync(data);
		
		const result = [];
		for await (let item of data) {
			let include = true;
			
			if (filter) {
				for (const key in filter) {
					const value = await Catalog.instance.get(filter[key]).getValue();
					include = include && (item[key] === value);
					if (!include) break;
				}
			}
			
			if (!include) continue;
			
			if (fields) item = fields.reduce((resultItem, field) => ({ ...resultItem, [field]: item[field] }), {});
			
			result.push(item);
			
			// TODO perhaps select randomly if not sorting?
			if (!sort && result.length >= limit) break;
		}
		
		if (sort) {
			result.sort((a, b) => b[sort] - a[sort]);
			
			if (limit) return result.slice(0, limit);
		}
		
		return result;
	}
}
