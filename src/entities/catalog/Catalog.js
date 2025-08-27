const CatalogField = require('./CatalogField');
const DataSourceCatalogField = require('./DataSourceCatalogField');
const InputCatalogField = require('./InputCatalogField');
const OutputCatalogField = require('./OutputCatalogField');
const config = require('../../utils/config');
const RequestContext = require('../../utils/RequestContext');
const UnknownError = require('../../utils/UnknownError');
const UnsupportedError = require('../../utils/UnsupportedError');
const Profiler = require('../../utils/Profiler');

class Catalog {
	_fields = {};
	_configuration;
	
	static get instance() {
		return RequestContext.keys.catalog ??= new this();
	}
	
	get configuration() {
		return this._configuration ??= config.get('catalog');
	}
	
	get fields() {
		return Profiler.run(() => Object.keys(this.configuration).map(fieldId => this.get(fieldId)), 'create all catalog fields');
	}
	
	createField(fieldId) {
		const fieldConfiguration = this.configuration[fieldId];
		
		if (!fieldConfiguration) throw new UnknownError('fieldId', fieldId, this.configuration);
		
		const mapping = {
			[CatalogField.TYPE.INPUT]: InputCatalogField,
			[CatalogField.TYPE.OUTPUT]: OutputCatalogField,
			[CatalogField.TYPE.DATA]: DataSourceCatalogField,
		};
		
		const catalogFieldClass = mapping[fieldConfiguration.type];
		
		if (!catalogFieldClass) throw new UnsupportedError('catalog field type', fieldConfiguration.type, mapping);
		
		return new catalogFieldClass(fieldId, this);
	}
	
	get(fieldId) {
		return this._fields[fieldId] ??= this.createField(fieldId);
	}
}

module.exports = Catalog;
