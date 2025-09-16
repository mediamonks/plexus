import ITargetDataSourceBehavior from './ITargetDataSourceBehavior';
import DataSourceBehavior from '../DataSourceBehavior';
import DataSourceItem from '../platform/DataSourceItem';
import StructuredDataSourceBehavior from '../data-type/StructuredDataSourceBehavior';
import Catalog from '../../catalog/Catalog';
import Storage from '../../storage/Storage';
import StorageFile from '../../storage/StorageFile';
import { JsonObject } from '../../../types/common';

export default class RawDataTargetDataSourceBehavior extends DataSourceBehavior implements ITargetDataSourceBehavior {
	static readonly InputData: (typeof DataSourceItem.DataContent)[];
	static readonly OutputData: (typeof DataSourceItem.DataContent)[];

	public async read(): Promise<typeof RawDataTargetDataSourceBehavior.OutputData> {
		const contents = await this.getContents() as typeof RawDataTargetDataSourceBehavior.OutputData;

		// TODO add support for spreadsheets
		if (!contents[0][0]) throw new Error('Unsupported input data for raw data target data source: must be JSONL');

		return contents.flat();
	}
	
	public async ingest(): Promise<void> {
		const data = await this.read() as AsyncGenerator<JsonObject>[];

		await Storage.get(StorageFile.TYPE.STRUCTURED_DATA, this.id).write(async function* () {
			for await (const generator of data) yield* generator;
		}());
	}
	
	public async query({ filter, limit, fields, sort }: typeof StructuredDataSourceBehavior.QueryParameters = {}): Promise<typeof RawDataTargetDataSourceBehavior.OutputData> {
		const data = await this.getData();
		
		if (!filter && !limit && !fields && !sort) return data;
		
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
