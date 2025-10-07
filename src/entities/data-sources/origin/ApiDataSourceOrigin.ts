import axios from 'axios';
import DataSourceOrigin from './DataSourceOrigin';
import CustomError from '../../error-handling/CustomError';
import { JsonField, JsonObject } from '../../../types/common';

export default class ApiDataSourceOrigin extends DataSourceOrigin {
	public static Configuration: {
		headers?: Record<string, string>;
		payload?: JsonObject;
		method?: 'GET' | 'POST';
		collectionPath?: string;
	}
	
	public async read(): Promise<JsonField> {
		// TODO: field-based payload
		
		const response = await axios.request({
			url: await this.dataSource.getResolvedUri(),
			method: this.dataSource.configuration.method,
			headers: this.dataSource.configuration.headers,
			data: this.dataSource.configuration.payload,
			responseType: 'json',
		});
		
		return response.data;
	}
	
	public async getText(): Promise<string> {
		let data = await this.read();
		
		if (typeof data !== 'string') data = JSON.stringify(data);
		
		return data;
	}
	
	public async getData(): Promise<AsyncGenerator<JsonObject>> {
		const data = await this.read();
		const { collectionPath } = this.dataSource.configuration;
		const path = collectionPath.split('.');
		let collection = data;
		while (path.length) {
			const key = path.shift();
			collection = collection[key];
			if (!collection) {
				throw new CustomError(`Invalid collection path "${collectionPath}" for data source "${this.dataSource.id}"`);
			}
		}
		
		if (!Array.isArray(collection)) {
			throw new CustomError(`Item at collection path "${collectionPath}" for data source "${this.dataSource.id}" is not an array`);
		}
		
		return (async function* () {
			for await (const item of collection) {
				yield item as JsonObject;
			}
		})();
	}
	
	public async getItems(): Promise<never> {
		throw new CustomError('File target not supported for API origin data sources');
	}
}
