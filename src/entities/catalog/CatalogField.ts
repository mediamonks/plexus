import Catalog from './Catalog';
import DataSourceCatalogField from './DataSourceCatalogField';
import InputCatalogField from './InputCatalogField';
import OutputCatalogField from './OutputCatalogField';
import UnknownError from '../../utils/UnknownError';
import { JsonField } from '../../types/common';
import DataSourceItem from '../data-sources/platform/DataSourceItem';

export default class CatalogField {
	_id: string;
	_catalog: Catalog;
	_configuration: typeof CatalogField.Configuration;
	_value: JsonField | DataSourceItem[];

	static Configuration: typeof DataSourceCatalogField.Configuration
		| typeof InputCatalogField.Configuration
		| typeof OutputCatalogField.Configuration;

	static TYPE = {
		INPUT: 'input',
		OUTPUT: 'output',
		DATA: 'data'
	} as const;
	
	constructor(id: string, catalog: Catalog) {
		this._id = id;
		this._catalog = catalog;
	}
	
	get id(): string {
		return this._id;
	}
	
	get configuration(): typeof CatalogField.Configuration {
		if (!this._configuration) {
			const configuration = this.catalog.configuration[this.id];
			if (!configuration) throw new UnknownError('catalog field', this.id, this.catalog.configuration);
			this._configuration = configuration as typeof CatalogField.Configuration;
		}
		
		return this._configuration;
	}
	
	get catalog(): Catalog {
		return this._catalog;
	}
	
	get type(): string {
		return String(this.configuration.type || '');
	}
	
	get example(): JsonField {
		return this.configuration.example;
	}
	
	async populate(): Promise<void> {
		throw new Error('Cannot create instance of CatalogField');
	}
	
	async getValue(): Promise<JsonField | DataSourceItem[]> {
		if (this._value === undefined) await this.populate();
		
		return this._value;
	}
}
