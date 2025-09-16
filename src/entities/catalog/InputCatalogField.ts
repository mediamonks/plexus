import CatalogField from './CatalogField';
import config from '../../utils/config';
import Debug from '../../utils/Debug';
import RequestContext from '../../utils/RequestContext';
import UnknownError from '../../utils/UnknownError';
import { JsonField, RequestPayload } from '../../types/common';
import DataSourceItem from '../data-sources/platform/DataSourceItem';

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
		if (!this.configuration.field) throw new Error(`Missing 'field' property for input field "${this.id}"`);
		
		return this.configuration.field;
	}
	
	public get required(): boolean {
		return !!this.configuration.required;
	}
	
	protected async populate(): Promise<JsonField | DataSourceItem[]> {
		Debug.log(`Populating input field "${this.id}"`, 'Catalog');
		
		let value = (RequestContext.get('payload') as RequestPayload).fields?.[this.payloadField];
		
		if (value === undefined) {
			if (this.required) throw new Error(`Field "${this.payloadField}" must be provided in payload`);
			
			return;
		}
		
		const inputFields = config.get('input-fields');
		const fieldValues = inputFields[this.payloadField];
		
		if (fieldValues) {
			if (!(value in fieldValues)) throw new UnknownError(`value for ${this.payloadField}`, value, fieldValues);
			value = fieldValues[value].description ?? fieldValues[value].label;
		}
		
		return this._value = value;
	}
}
