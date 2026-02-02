import CatalogField from './CatalogField';
import DataSourceCatalogField from './DataSourceCatalogField';
import InputCatalogField from './InputCatalogField';
import OutputCatalogField from './OutputCatalogField';
import CustomError from '../error-handling/CustomError';
import UnknownError from '../error-handling/UnknownError';
import UnsupportedError from '../error-handling/UnsupportedError';
import Config from '../../core/Config';
import RequestContext from '../../core/RequestContext';
import { JsonField, SchemaProperty } from '../../types/common';

type AgentOutputSchemaProperty = SchemaProperty & {
	example: JsonField;
};

type AgentOutputSchema = {
	type: 'object';
	properties: Record<string, AgentOutputSchemaProperty>;
	required: string[];
	additionalProperties: boolean;
};

export default class Catalog {
	private readonly _fields: Record<string, CatalogField> = {};
	private _configuration: typeof Catalog.Configuration;
	
	public static readonly Configuration: Record<string, typeof CatalogField.Configuration>;
	
	static get instance(): Catalog {
		return (RequestContext.store.catalog as Catalog) ??= new this();
	}
	
	public get configuration(): typeof Catalog.Configuration {
		return this._configuration ??= Config.get('catalog');
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
	
	public getAgentOutputSchema(agentId: string): AgentOutputSchema {
		const schema = {
			type: 'object' as const,
			properties: {},
			required: [],
			additionalProperties: false,
		};
		
		for (const key in this.configuration) {
			const fieldConfig = this.configuration[key] as typeof CatalogField.Configuration;
			
			if (fieldConfig.type !== CatalogField.TYPE.OUTPUT || fieldConfig.agent !== agentId) continue;
			
			if (!fieldConfig.example) throw new CustomError(`Missing example for catalog field "${key}"`);
			
			const fieldName = fieldConfig.field ?? key;
			schema.properties[fieldName] = {
				type: typeof fieldConfig.example, // TODO: type: [ <type>, null ] for optional
				description: fieldConfig.description,
				example: fieldConfig.example,
			};
			
			if (fieldConfig.required) schema.required.push(fieldName); // TODO: always required & strict: true
		}
		
		return schema;
	}
}
