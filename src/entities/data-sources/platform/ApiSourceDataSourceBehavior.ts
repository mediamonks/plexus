import axios from 'axios';
import IPlatformDataSourceBehavior from './IPlatformDataSourceBehavior';
import { JsonObject } from '../../../types/common';
import DataSourceItem from './DataSourceItem';

export default class ApiSourceDataSourceBehavior implements IPlatformDataSourceBehavior {
	public static Configuration: {
		headers?: Record<string, string>;
		payload?: JsonObject;
		method?: 'GET' | 'POST';
	}
	
	public async getItems(): Promise<DataSourceItem[]> {
		const response = await axios.request({
			url: this.dataSource.configuration.uri,
			method: this.dataSource.configuration.method,
			headers: this.dataSource.configuration.headers,
			data: this.dataSource.configuration.payload,
			responseType: 'json',
		});
		
		return response.data;
	}
}
