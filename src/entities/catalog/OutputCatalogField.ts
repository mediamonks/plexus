import CatalogField from './CatalogField';
import Agents from '../agents/Agents';
import DataSourceItem from '../data-sources/origin/DataSourceItem';
import CustomError from '../error-handling/CustomError';
import Debug from '../../core/Debug';
import { JsonField } from '../../types/common';

export default class OutputCatalogField extends CatalogField {
	static readonly Configuration: typeof CatalogField.BaseConfiguration & {
		type: 'output';
		agent: string;
		field?: string;
	};

	public get configuration(): typeof OutputCatalogField.Configuration {
		return super.configuration as typeof OutputCatalogField.Configuration;
	}

	public get outputField(): string {
		return this.configuration.field ?? this.id;
	}
	
	public get agentId(): string {
		const { agent } = this.configuration;
		
		if (typeof agent !== 'string') throw new CustomError(`Missing or invalid 'agent' property for output field "${this.id}"`);
		
		return agent;
	}
	
	protected async populate(): Promise<JsonField | DataSourceItem<unknown, unknown>[]> {
		Debug.log(`Populating output field "${this.id}"`, 'Catalog');
		
		const result = await Agents.get(this.agentId, this.catalog).invoke() as Record<string, JsonField>;
		
		const value = result[this.outputField];
		
		if (value === undefined) throw new CustomError(`Agent "${this.agentId}" failed to output field "${this.outputField}"`);
		
		return value;
	}
}
