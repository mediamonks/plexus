import CatalogField from './CatalogField';
import DataSourceCatalogField from './DataSourceCatalogField';
import ICatalogField from './ICatalogField';
import InputCatalogField from './InputCatalogField';
import OutputCatalogField from './OutputCatalogField';
import CustomError from '../error-handling/CustomError';
import UnknownError from '../error-handling/UnknownError';
import UnsupportedError from '../error-handling/UnsupportedError';
import { v4 as uuid } from 'uuid';
import Config from '../../core/Config';
import RequestContext from '../../core/RequestContext';
import { AgentOutputSchema, JsonField, SchemaProperty } from '../../types/common';

export default class Catalog {
	public readonly id: string = uuid();
	protected readonly _fields: Record<string, ICatalogField> = {};
	private _configuration: typeof Catalog.Configuration;
	
	public static readonly Configuration: Record<string, typeof CatalogField.Configuration>;
	
	static get instance(): Catalog {
		let catalog = RequestContext.get('catalog') as Catalog;
		if (!catalog) {
			catalog = new this();
			RequestContext.set('catalog', catalog);
		}
		return catalog;
	}
	
	public get configuration(): typeof Catalog.Configuration {
		return this._configuration ??= Config.get('catalog');
	}
	
	public createField(fieldId: string): ICatalogField {
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
	
	public get(fieldId: string): ICatalogField {
		return this._fields[fieldId] ??= this.createField(fieldId);
	}
	
	public static resolveExample(example: JsonField): JsonField {
		if (typeof example === 'string') {
			const exampleRef = /^#(\w+)$/.exec(example);
			if (exampleRef && exampleRef[1]) {
				example = Config.get(`examples/${exampleRef[1]}`) as JsonField;
			
				if (!example) throw new CustomError(`Example reference "${exampleRef[1]}" does not exist`);
			}
		}
		return example;
	}
	
	private static getFieldSchema(value: JsonField): SchemaProperty {
		if (value === null) throw new CustomError('Cannot derive schema from null example value');
		
		if (Array.isArray(value)) return { type: 'array', items: Catalog.getFieldSchema(value[0]) };
		
		if (typeof value === 'object') return {
			type: 'object',
			properties: Object.fromEntries(Object.entries(value).map(([key, value]) => [key, Catalog.getFieldSchema(value)])),
			required: Object.keys(value),
			additionalProperties: false,
		};
		
		return { type: typeof value as 'string' | 'number' | 'boolean' };
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
			
			const example = Catalog.resolveExample(fieldConfig.example);
			
			const fieldName = fieldConfig.field ?? key;
			schema.properties[fieldName] = {
				...Catalog.getFieldSchema(example),
				description: fieldConfig.description,
				example,
			};
			
			if (fieldConfig.required) schema.required.push(fieldName); // TODO: always required & strict: true
		}
		
		return schema;
	}
}
