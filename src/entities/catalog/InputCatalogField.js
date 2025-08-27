const CatalogField = require('./CatalogField');
const config = require('../../utils/config');
const Debug = require('../../utils/Debug');
const RequestContext = require('../../utils/RequestContext');
const UnknownError = require('../../utils/UnknownError');

class InputCatalogField extends CatalogField {
	get payloadField() {
		if (!this.configuration.field) throw new Error(`Missing 'field' property for input field "${this.id}"`);
		
		return this.configuration.field;
	}
	
	get required() {
		return !!this.configuration.required;
	}
	
	async populate() {
		Debug.log(`Populating input field "${this.id}"`, 'Catalog');
		
		let value = RequestContext.get('payload')[this.payloadField];
		
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
		
		this._value = value;
	}
}

module.exports = InputCatalogField;
