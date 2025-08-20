const DataSourceCatalogField = require('./DataSourceCatalogField');
const InputCatalogField = require('./InputCatalogField');
const OutputCatalogField = require('./OutputCatalogField');
const config = require('../../utils/config');
const UnknownError = require('../../utils/UnknownError');
const UnsupportedError = require('../../utils/UnsupportedError');

module.exports = class Catalog {
	_fields = {};
	_configuration;
	
	get configuration() {
		return this._configuration ??= config.get('catalog');
	}
	
	createField(fieldId) {
		const fieldConfiguration = this.configuration[fieldId];
		
		if (!fieldConfiguration) throw new UnknownError('fieldId', fieldId, this.configuration);
		
		const mapping = {
			input: InputCatalogField,
			output: OutputCatalogField,
			data: DataSourceCatalogField,
		};
		
		const fieldClass = mapping[fieldConfiguration.type];
		
		if (!fieldClass) throw new UnsupportedError('catalog field type', fieldConfiguration.type, mapping);
		
		return new fieldClass(fieldId);
	}
	
	get(fieldId) {
		return this._fields[fieldId] ??= this.createField(fieldId);
	}
}
