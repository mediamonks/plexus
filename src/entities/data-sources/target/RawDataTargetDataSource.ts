import DataSource from '../DataSource';
import Catalog from '../../catalog/Catalog';
import DataSourceCatalogField from '../../catalog/DataSourceCatalogField';
import CustomError from '../../error-handling/CustomError';
import Storage from '../../storage/Storage';
import StorageFile from '../../storage/StorageFile';
import Debug from '../../../core/Debug';
import RequestContext from '../../../core/RequestContext';
import { JsonObject } from '../../../types/common';

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
		const catalog = RequestContext.get('catalog') as Catalog;
		for await (let item of data) {
			let include = true;
			
			if (filter) {
				for (const key in filter) {
					const value = await catalog.get(filter[key]).getValue();
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
	
	public async getToolCallSchema(): Promise<never> {
		throw new CustomError('Not implemented');
	}
	
	public async toolCall(): Promise<never> {
		throw new CustomError('Not implemented');
	}
};
