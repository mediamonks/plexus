import Catalog from './Catalog';
import DataSourceCatalogField from './DataSourceCatalogField';
import InputCatalogField from './InputCatalogField';
import OutputCatalogField from './OutputCatalogField';
import ErrorLog from '../../utils/ErrorLog';
import UnknownError from '../../utils/UnknownError';
import { JsonField } from '../../types/common';
import DataSourceItem from '../data-sources/platform/DataSourceItem';

export default class CatalogField {
	private readonly _id: string;
	private readonly _catalog: Catalog;
	private _configuration: typeof CatalogField.Configuration;
	protected _value: Promise<JsonField | DataSourceItem[]> | JsonField | DataSourceItem[];

	static readonly Configuration: typeof DataSourceCatalogField.Configuration
		| typeof InputCatalogField.Configuration
		| typeof OutputCatalogField.Configuration;

	static readonly TYPE = {
		INPUT: 'input',
		OUTPUT: 'output',
		DATA: 'data'
	} as const;
	
	public constructor(id: string, catalog: Catalog) {
		this._id = id;
		this._catalog = catalog;
	}
	
	public get id(): string {
		return this._id;
	}
	
	public get configuration(): typeof CatalogField.Configuration {
		if (!this._configuration) {
			const configuration = this.catalog.configuration[this.id];
			if (!configuration) ErrorLog.throw(new UnknownError('catalog field', this.id, this.catalog.configuration));
			this._configuration = configuration as typeof CatalogField.Configuration;
		}
		
		return this._configuration;
	}
	
	public get catalog(): Catalog {
		return this._catalog;
	}
	
	public get type(): string {
		return String(this.configuration.type || '');
	}
	
	public get example(): JsonField {
		return this.configuration.example;
	}
	
	protected async populate(): Promise<JsonField | DataSourceItem[]> {
		throw new Error('Cannot create instance of CatalogField');
	}
	
	public async getValue(): Promise<JsonField | DataSourceItem[]> {
		return this._value ??= this.populate();
	}
}
