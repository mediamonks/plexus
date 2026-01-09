import DataSource from '../DataSource';
import Catalog from '../../catalog/Catalog';
import DataSourceCatalogField from '../../catalog/DataSourceCatalogField';
import Storage from '../../storage/Storage';
import StorageFile from '../../storage/StorageFile';
import { JsonObject } from '../../../types/common';
import Debug from '../../../core/Debug';

type QueryResult = JsonObject[];

export default class RawDataTargetDataSource extends DataSource {
	public async ingest(): Promise<void> {
		Debug.log(`Ingesting raw data target data source "${this.id}"`, 'RawDataTargetDataSource');
		
		const data: AsyncGenerator<JsonObject> = await this.origin.getData();
		
		await Storage.get(StorageFile.TYPE.STRUCTURED_DATA, this.id).write(data);
	}
	
	public async query({ filter, limit, fields, sort }: typeof DataSourceCatalogField.QueryParameters): Promise<QueryResult> {
		let data: AsyncGenerator<JsonObject>;
		try {
			data = await Storage.get(StorageFile.TYPE.STRUCTURED_DATA, this.id).read();
		} catch (error) {
			data = await this.origin.getData();
		}
		
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
};
