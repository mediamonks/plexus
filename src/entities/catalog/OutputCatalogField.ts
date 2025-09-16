import CatalogField from './CatalogField';
import Agents from '../agents/Agents';
import Debug from '../../utils/Debug';
import { JsonField } from '../../types/common';
import DataSourceItem from '../data-sources/platform/DataSourceItem';

export default class OutputCatalogField extends CatalogField {
	static readonly Configuration: {
		type: 'output';
		example: JsonField;
		agent: string;
		field: string;
	};

	public get configuration(): typeof OutputCatalogField.Configuration {
		return super.configuration as typeof OutputCatalogField.Configuration;
	}

	public get outputField(): string {
		const { field } = this.configuration;
		
		if (typeof field !== 'string') throw new Error(`Missing or invalid 'field' property for output field "${this.id}"`);
		
		return field;
	}
	
	public get agentId(): string {
		const { agent } = this.configuration;
		
		if (typeof agent !== 'string') throw new Error(`Missing or invalid 'agent' property for output field "${this.id}"`);
		
		return agent;
	}
	
	protected async populate(): Promise<JsonField | DataSourceItem[]> {
		Debug.log(`Populating output field "${this.id}"`, 'Catalog');
		
		const result = await Agents.get(this.agentId, this.catalog).invoke() as Record<string, JsonField>;
		
		const value = result[this.outputField];
		
		if (value === undefined) throw new Error(`Agent "${this.agentId}" failed to output field "${this.outputField}"`);
		
		return this._value = value;
	}
}
