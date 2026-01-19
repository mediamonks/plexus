import CatalogField from './CatalogField';
import DataSourceItem from '../data-sources/origin/DataSourceItem';
import CustomError from '../error-handling/CustomError';
import UnknownError from '../error-handling/UnknownError';
import Config from '../../core/Config';
import Debug from '../../core/Debug';
import RequestContext from '../../core/RequestContext';
import Configuration from '../../types/Configuration';
import { JsonField, InvokePayload } from '../../types/common';
import InputDataSourceItem from '../data-sources/origin/InputDataSourceItem';

export default class InputCatalogField extends CatalogField {
	static readonly Configuration: typeof CatalogField.BaseConfiguration & {
		type: 'input';
		field?: string;
		required?: boolean;
		fileName?: string;
		mimeType?: string;
	};

	public get configuration(): typeof InputCatalogField.Configuration {
		return super.configuration as typeof InputCatalogField.Configuration;
	}

	public get payloadField(): string {
		return this.configuration.field ?? this.id;
	}
	
	public get required(): boolean {
		return !!this.configuration.required;
	}
	
	protected async populate(): Promise<JsonField | DataSourceItem[]> {
		Debug.log(`Populating input field "${this.id}"`, 'Catalog');
		
		const payload = RequestContext.get('payload') as InvokePayload;
		
		let value = payload.fields?.[this.payloadField] as string;
		
		if (value === undefined) {
			if (this.required) throw new CustomError(`Field "${this.payloadField}" must be provided in payload`);
			
			return;
		}
		
		if (this.configuration.fileName) {
			if (!this.configuration.mimeType) throw new CustomError(`Missing 'mimeType' property for input field "${this.id}"`);
			
			return [new InputDataSourceItem(this.configuration.fileName, this.configuration.mimeType, value)];
		}
		
		const inputFields = Config.get('input-fields') as Configuration['input-fields'];
		const fieldValues = inputFields[this.payloadField];
		
		if (fieldValues) {
			if (!(value in fieldValues)) throw new UnknownError(`value for ${this.payloadField}`, value as string, fieldValues);
			value = fieldValues[value].description ?? fieldValues[value].label;
		}
		
		return value;
	}
}
