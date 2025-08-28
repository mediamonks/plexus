import DataSourceBehavior from '../DataSourceBehavior';
import StructuredDataSourceBehavior from '../data-type/StructuredDataSourceBehavior';
import Storage from '../../storage/Storage';
import StorageFile from '../../storage/StorageFile';
import { JsonObject } from '../../../types/common';

class RawDataDataSourceTarget extends DataSourceBehavior {
	async read(): Promise<AsyncGenerator<JsonObject>> {
		const contents = await this.getContents();
		return contents.flat();
	}
	
	async ingest(): Promise<void> {
		const contents = await this.read();
		return Storage.get(StorageFile.TYPE.STRUCTURED_DATA, this.id).write(contents.join('\n'));
	}
	
	async query({ filter, limit, fields, sort }: typeof StructuredDataSourceBehavior.QueryParameters = {}): Promise<any[]> {
		const data = this.getData();
		
		if (!filter && !limit && !fields && !sort) return data;
		
		const result = [];
		for await (let item of data) {
			let include = true;
			
			if (filter) {
				for (const key in filter) {
					const value = await this.get(filter[key]);
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

export default RawDataDataSourceTarget;
