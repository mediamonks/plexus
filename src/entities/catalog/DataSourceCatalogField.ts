import CatalogField from './CatalogField';
import DataSource from '../data-sources/DataSource';
import DataSources from '../data-sources/DataSources';
import StructuredDataSourceBehavior from '../data-sources/data-type/StructuredDataSourceBehavior';
import DataSourceItem from '../data-sources/platform/DataSourceItem';
import CustomError from '../error-handling/CustomError';
import Debug from '../../utils/Debug';
import { JsonField } from '../../types/common';

export default class DataSourceCatalogField extends CatalogField {
	static readonly Configuration: {
		type: 'data';
		example: JsonField;
		dataSource: string;
		query: {
			input?: string;
			limit?: number;
			filter?: Record<string, string>;
			fields?: string[];
			sort?: string;
		},
		input?: string; // TODO for backwards compatibility
		limit?: number; // TODO for backwards compatibility
		filter?: Record<string, string>; // TODO for backwards compatibility
		fields?: string[]; // TODO for backwards compatibility
		sort?: string; // TODO for backwards compatibility
	};

	public get configuration(): typeof DataSourceCatalogField.Configuration {
		return super.configuration as typeof DataSourceCatalogField.Configuration;
	}

	public get dataSourceId(): string {
		if (!this.configuration.dataSource) throw new CustomError(`Missing 'dataSource' property for data field "${this.id}"`);
		
		return this.configuration.dataSource;
	}
	
	public get inputField(): string {
		return this.configuration.query?.input ?? this.configuration.input; // TODO for backwards compatibility
	}
	
	public get filter(): Record<string, string> {
		return this.configuration.query?.filter ?? this.configuration.filter; // TODO for backwards compatibility
	}
	
	public get queryParameters(): typeof StructuredDataSourceBehavior.QueryParameters {
		return {
			limit: this.configuration.query?.limit ?? this.configuration.limit, // TODO for backwards compatibility
			fields: this.configuration.query?.fields ?? this.configuration.fields, // TODO for backwards compatibility
			sort: this.configuration.query?.sort ?? this.configuration.sort, // TODO for backwards compatibility
		};
	}
	
	public get dataSource(): DataSource {
		return DataSources.get(this.dataSourceId);
	}
	
	protected async populate(): Promise<JsonField | DataSourceItem[]> {
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

		// TODO do we need to assign to this._value here?
		return this._value = value;
	}
}
