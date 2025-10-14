import CatalogField from './CatalogField';
import DataSourceCatalogField from './DataSourceCatalogField';
import InputCatalogField from './InputCatalogField';
import OutputCatalogField from './OutputCatalogField';
import UnknownError from '../error-handling/UnknownError';
import UnsupportedError from '../error-handling/UnsupportedError';
import Config from '../../core/Config';
import RequestContext from '../../core/RequestContext';
import { JsonObject } from '../../types/common';

export default class Catalog {
	private readonly _fields: Record<string, CatalogField> = {};
	private _configuration: typeof Catalog.Configuration;
	
	public static readonly Configuration: Record<string, typeof CatalogField.Configuration>;
	
	static get instance(): Catalog {
		return (RequestContext.store.catalog as Catalog) ??= new this();
	}
	
	public get configuration(): JsonObject {
		return this._configuration ??= Config.get('catalog') as typeof Catalog.Configuration;
	}
	
	public createField(fieldId: string): CatalogField {
		const fieldConfiguration = this.configuration[fieldId] as typeof CatalogField.Configuration;
		
		if (!fieldConfiguration) throw new UnknownError('fieldId', fieldId, this.configuration);
		
		const mapping = {
			[CatalogField.TYPE.INPUT]: InputCatalogField,
			[CatalogField.TYPE.OUTPUT]: OutputCatalogField,
			[CatalogField.TYPE.DATA]: DataSourceCatalogField,
		};
		
		const catalogFieldClass = mapping[fieldConfiguration.type];
		
		if (!catalogFieldClass) throw new UnsupportedError('catalog field type', fieldConfiguration.type, Object.keys(mapping));
		
		return new catalogFieldClass(fieldId, this);
	}
	
	public get(fieldId: string): CatalogField {
		return this._fields[fieldId] ??= this.createField(fieldId);
	}
	
	public getAgentOutputSchema(agentId: string): JsonObject {
		const schema = {};
		
		for (const key in this.configuration) {
			const fieldConfig = this.configuration[key] as typeof OutputCatalogField.Configuration;
			
			if (fieldConfig.type !== CatalogField.TYPE.OUTPUT || fieldConfig.agent !== agentId) continue;
			
			schema[fieldConfig.field] = fieldConfig.example;
		}
		
		return schema;
	}
}
