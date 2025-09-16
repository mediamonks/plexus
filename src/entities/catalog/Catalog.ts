import CatalogField from './CatalogField';
import DataSourceCatalogField from './DataSourceCatalogField';
import InputCatalogField from './InputCatalogField';
import OutputCatalogField from './OutputCatalogField';
import config from '../../utils/config';
import ErrorLog from '../../utils/ErrorLog';
import RequestContext from '../../utils/RequestContext';
import UnknownError from '../../utils/UnknownError';
import UnsupportedError from '../../utils/UnsupportedError';
import Profiler from '../../utils/Profiler';
import { JsonObject } from '../../types/common';

export default class Catalog {
	private readonly _fields: Record<string, CatalogField> = {};
	private _configuration: typeof Catalog.Configuration;
	
	static readonly Configuration: Record<string, typeof CatalogField.Configuration>;
	
	static get instance(): Catalog {
		return (RequestContext.keys.catalog as Catalog) ??= new this();
	}
	
	get configuration(): JsonObject {
		return this._configuration ??= config.get('catalog') as typeof Catalog.Configuration;
	}
	
	get fields(): CatalogField[] {
		return Profiler.run(() => Object.keys(this.configuration).map(fieldId => this.get(fieldId)), 'create all catalog fields');
	}
	
	createField(fieldId: string): CatalogField {
		const fieldConfiguration = this.configuration[fieldId] as typeof CatalogField.Configuration;
		
		if (!fieldConfiguration) ErrorLog.throw(new UnknownError('fieldId', fieldId, this.configuration));
		
		const mapping = {
			[CatalogField.TYPE.INPUT]: InputCatalogField,
			[CatalogField.TYPE.OUTPUT]: OutputCatalogField,
			[CatalogField.TYPE.DATA]: DataSourceCatalogField,
		};
		
		const catalogFieldClass = mapping[fieldConfiguration.type];
		
		if (!catalogFieldClass) ErrorLog.throw(new UnsupportedError('catalog field type', fieldConfiguration.type, mapping));
		
		return new catalogFieldClass(fieldId, this);
	}
	
	get(fieldId: string): CatalogField {
		return this._fields[fieldId] ??= this.createField(fieldId);
	}
}
