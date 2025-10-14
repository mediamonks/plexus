import CatalogField from './CatalogField';
import DataSourceItem from '../data-sources/origin/DataSourceItem';
import CustomError from '../error-handling/CustomError';
import UnknownError from '../error-handling/UnknownError';
import Config from '../../core/Config';
import Debug from '../../core/Debug';
import RequestContext from '../../core/RequestContext';
import { JsonField, RequestPayload, Configuration } from '../../types/common';

export default class InputCatalogField extends CatalogField {
	static readonly Configuration: {
		type: 'input';
		example: JsonField;
		field: string;
		required?: boolean;
	};

	public get configuration(): typeof InputCatalogField.Configuration {
		return super.configuration as typeof InputCatalogField.Configuration;
	}

	public get payloadField(): string {
		if (!this.configuration.field) throw new CustomError(`Missing 'field' property for input field "${this.id}"`);
		
		return this.configuration.field;
	}
	
	public get required(): boolean {
		return !!this.configuration.required;
	}
	
	protected async populate(): Promise<JsonField | DataSourceItem<unknown, unknown>[]> {
		Debug.log(`Populating input field "${this.id}"`, 'Catalog');
		
		const payload = RequestContext.get('payload') as RequestPayload;
		
		let value = payload.fields?.[this.payloadField] as string;
		
		if (value === undefined) {
			if (this.required) throw new CustomError(`Field "${this.payloadField}" must be provided in payload`);
			
			return;
		}
		
		const inputFields = Config.get('input-fields') as Configuration['input-fields'];
		const fieldValues = inputFields[this.payloadField];
		
		if (fieldValues) {
			if (!(value in fieldValues)) throw new UnknownError(`value for ${this.payloadField}`, value as string, fieldValues);
			value = fieldValues[value].description ?? fieldValues[value].label;
		}
		
		return this._value = value;
	}
}
