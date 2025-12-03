import CatalogField from './CatalogField';
import DataSource from '../data-sources/DataSource';
import DataSources from '../data-sources/DataSources';
import DataSourceItem from '../data-sources/origin/DataSourceItem';
import CustomError from '../error-handling/CustomError';
import Debug from '../../core/Debug';
import { JsonField } from '../../types/common';

export default class DataSourceCatalogField extends CatalogField {
	public static readonly Configuration: typeof CatalogField.BaseConfiguration & {
		type: 'data';
		source?: string;
		dataSource?: string; // TODO for backwards compatibility
		query?: typeof DataSourceCatalogField.QueryParameters,
	} & typeof DataSourceCatalogField.QueryParameters; // TODO for backwards compatibility
	
	public static readonly QueryParameters: {
		input?: string;
		filter?: Record<string, string>;
		limit?: number;
		fields?: string[];
		sort?: string;
	};
	
	public get configuration(): typeof DataSourceCatalogField.Configuration {
		return super.configuration as typeof DataSourceCatalogField.Configuration;
	}

	public get dataSourceId(): string {
		const source = this.configuration.source ?? this.configuration.dataSource; // TODO for backwards compatibility
		
		if (!source) throw new CustomError(`Missing 'source' property for data field "${this.id}"`);
		
		return source;
	}
	
	public get inputField(): string {
		return this.configuration.query?.input ?? this.configuration.input; // TODO for backwards compatibility
	}
	
	public get filter(): Record<string, string> {
		return this.configuration.query?.filter ?? this.configuration.filter; // TODO for backwards compatibility
	}
	
	public get queryParameters(): typeof DataSourceCatalogField.QueryParameters {
		return {
			limit: this.configuration.query?.limit ?? this.configuration.limit, // TODO for backwards compatibility
			fields: this.configuration.query?.fields ?? this.configuration.fields, // TODO for backwards compatibility
			sort: this.configuration.query?.sort ?? this.configuration.sort, // TODO for backwards compatibility
		};
	}
	
	public get dataSource(): DataSource {
		return DataSources.get(this.dataSourceId);
	}
	
	protected async populate(): Promise<JsonField | DataSourceItem<unknown, unknown>[]> {
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
		
		return this.dataSource.query({ input, filter, ...this.queryParameters });
	}
};
