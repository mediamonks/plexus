import CatalogField from './CatalogField';
import Agents from '../agents/Agents';
import Debug from '../../utils/Debug';
import { JsonField } from '../../types/common';

export default class OutputCatalogField extends CatalogField {
	static Configuration: {
		type: 'output';
		example: JsonField;
		agent: string;
		field: string;
		required?: boolean;
	};

	get configuration(): typeof OutputCatalogField.Configuration {
		return super.configuration as typeof OutputCatalogField.Configuration;
	}

	get outputField(): string {
		const field = this.configuration.field;
		if (typeof field !== 'string') throw new Error(`Missing or invalid 'field' property for output field "${this.id}"`);
		
		return field;
	}
	
	get agentId(): string {
		const agent = this.configuration.agent;
		if (typeof agent !== 'string') throw new Error(`Missing or invalid 'agent' property for output field "${this.id}"`);
		
		return agent;
	}
	
	get required(): boolean {
		return !!this.configuration.required;
	}
	
	async populate(): Promise<void> {
		Debug.log(`Populating output field "${this.id}"`, 'Catalog');
		
		const result = await Agents.get(this.agentId, this.catalog).invoke() as Record<string, unknown>;
		
		const value = result[this.outputField];
		
		if (value === undefined) throw new Error(`Agent "${this.agentId}" failed to output field "${this.outputField}"`);
		
		this._value = value;
	}
}

