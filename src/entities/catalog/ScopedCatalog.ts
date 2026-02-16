import Catalog from './Catalog';
import ICatalogField from './ICatalogField';
import ScopedCatalogField from './ScopedCatalogField';
import type { CatalogFieldValue, JsonField } from '../../types/common';

export default class ScopedCatalog extends Catalog {
	private readonly _parent: Catalog;
	private readonly _scopedFields: Record<string, ICatalogField> = {};
	
	public constructor(parent: Catalog) {
		super();
		this._parent = parent;
	}
	
	public get configuration(): typeof Catalog.Configuration {
		return this._parent.configuration;
	}
	
	public set(fieldName: string, value: CatalogFieldValue, example?: JsonField): void {
		this._scopedFields[fieldName] = new ScopedCatalogField(fieldName, this, value, example);
	}
	
	public get(fieldId: string): ICatalogField {
		if (this._scopedFields[fieldId]) return this._scopedFields[fieldId];
		return this._parent.get(fieldId);
	}
}
