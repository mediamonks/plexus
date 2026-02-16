import DataSourceItem from '../data-sources/origin/DataSourceItem';
import type Catalog from './Catalog';
import type ICatalogField from './ICatalogField';
import type { CatalogFieldValue, JsonField } from '../../types/common';

export default class ScopedCatalogField implements ICatalogField {
	public constructor(
		private _id: string,
		private _catalog: Catalog,
		private _value: CatalogFieldValue,
		private _example?: JsonField,
	) {}
	
	public get example(): JsonField {
		const configuration = this._catalog.configuration[this._id];
		return configuration?.example ?? this._example;
	}
	
	public getValue(): Promise<CatalogFieldValue> {
		return Promise.resolve(this._value);
	}
	
	public async toJSON(): Promise<JsonField> {
		if (this._value instanceof Array && this._value[0] instanceof DataSourceItem) return this._value.map(item => item.toJSON());
		return this._value as JsonField;
	}
}
