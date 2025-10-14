import Catalog from './Catalog';
import DataSourceCatalogField from './DataSourceCatalogField';
import InputCatalogField from './InputCatalogField';
import OutputCatalogField from './OutputCatalogField';
import DataSourceItem from '../data-sources/origin/DataSourceItem';
import CustomError from '../error-handling/CustomError';
import UnknownError from '../error-handling/UnknownError';
import { JsonField } from '../../types/common';

export default class CatalogField {
	private readonly _id: string;
	private readonly _catalog: Catalog;
	private _configuration: typeof CatalogField.Configuration;
	protected _value: Promise<JsonField | DataSourceItem<unknown, unknown>[]> | JsonField | DataSourceItem<unknown, unknown>[];

	static readonly BaseConfiguration: {
		type: 'input' | 'output' | 'data',
		example: string,
	};
	
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
			if (!configuration) throw new UnknownError('catalog field', this.id, this.catalog.configuration);
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
	
	protected async populate(): Promise<JsonField | DataSourceItem<unknown, unknown>[]> {
		throw new CustomError('Cannot create instance of CatalogField');
	}
	
	public async getValue(): Promise<JsonField | DataSourceItem<unknown, unknown>[]> {
		return this._value ??= this.populate();
	}
	
	public async toJSON(): Promise<JsonField> {
		const value = await this.getValue();
		if (value instanceof Array && value[0] instanceof DataSourceItem) return value.map(item => item.toJSON());
		return value as JsonField;
	}
}
