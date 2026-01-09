import axios from 'axios';
import DataSourceOrigin from './DataSourceOrigin';
import CustomError from '../../error-handling/CustomError';
import { JsonField, JsonObject } from '../../../types/common';

export default class ApiDataSourceOrigin extends DataSourceOrigin {
	public static readonly Configuration: {
		headers?: Record<string, string>;
		payload?: JsonObject;
		method?: 'GET' | 'POST';
		collectionPath?: string;
	};
	
	public async read(): Promise<JsonField> {
		// TODO: field-based payload
		
		const response = await axios.request({
			url: await this.dataSource.getResolvedUri(),
			method: this.configuration.method ?? 'GET',
			headers: this.configuration.headers,
			data: this.configuration.payload,
			responseType: 'json',
		});
		
		return response.data;
	}
	
	public async getText(): Promise<string> {
		let data = await this.read();
		
		if (typeof data !== 'string') data = JSON.stringify(data);
		
		return data as string;
	}
	
	public async getData(): Promise<AsyncGenerator<JsonObject>> {
		let data = await this.read();
		
		const { collectionPath } = this.configuration;
		if (collectionPath) {
			const path = collectionPath.split('.');
			while (path.length) {
				const key = path.shift();
				data = data[key];
				if (!data) {
					throw new CustomError(`Invalid collection path "${collectionPath}" for data source "${this.dataSource.id}"`);
				}
			}
		}
		
		if (!Array.isArray(data)) {
			throw new CustomError(`Item at collection path "${collectionPath}" for data source "${this.dataSource.id}" is not an array`);
		}
		
		return (async function* () {
			for await (const item of data) {
				yield item as JsonObject;
			}
		})();
	}
	
	public async getItems(): Promise<never> {
		throw new CustomError('File target not supported for API origin data sources');
	}
}
