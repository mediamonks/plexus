import CatalogField from './CatalogField';
import DataSources from '../data-sources/DataSources';
import Debug from '../../utils/Debug';
import DataSource from '../data-sources/DataSource';
import StructuredDataSourceBehavior from '../data-sources/data-type/StructuredDataSourceBehavior';
import { JsonField, JsonObject } from '../../types/common';
import DataSourceItem from '../data-sources/platform/DataSourceItem';

export default class DataSourceCatalogField extends CatalogField {
	static Configuration: {
		type: 'data';
		example: JsonField;
		dataSource: string;
		required?: boolean;
		input?: string;
		limit?: number;
		filter?: JsonObject;
		fields?: string[];
		sort?: string;
	};

	get configuration(): typeof DataSourceCatalogField.Configuration {
		return super.configuration as typeof DataSourceCatalogField.Configuration;
	}

	get dataSourceId(): string {
		if (!this.configuration.dataSource) throw new Error(`Missing 'dataSource' property for data field "${this.id}"`);
		
		return this.configuration.dataSource;
	}
	
	get inputField(): string {
		return this.configuration.input;
	}
	
	get filter(): Record<string, string> {
		return this.configuration.filter as Record<string, string>;
	}
	
	get queryParameters(): typeof StructuredDataSourceBehavior.QueryParameters {
		return {
			limit: this.configuration.limit,
			fields: this.configuration.fields,
			sort: this.configuration.sort,
		};
	}
	
	get dataSource(): DataSource {
		return DataSources.get(this.dataSourceId);
	}
	
	async populate(): Promise<JsonField | DataSourceItem[]> {
		Debug.log(`Populating data source field "${this.id}"`, 'Catalog');
		
		const promises = [];
		
		let input;
		if (this.inputField) {
			promises.push(
				this.catalog.get(this.inputField).getValue()
					.then(value => { input = value; })
			);
		}
		
		const filter = {};
		if (this.filter) {
			for (const key in this.filter) {
				promises.push(
					this.catalog.get(this.filter[key]).getValue()
						.then(value => { filter[key] = value; })
				);
			}
		}
		
		await Promise.all(promises);
		
		const value = await this.dataSource.query({ input, filter, ...this.queryParameters });

		let result;
		if (value instanceof Object && Symbol.asyncIterator in value) {
			result = [];
			for await (const item of value) result.push(item);
		} else {
			result = value;
		}
		
		// TODO do we need to assign to this._value here?
		return this._value = result;
	}
}
