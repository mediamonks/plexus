const requestContext = require('../../utils/request-context');
const UnknownError = require('../../utils/UnknownError');

class CatalogField {
	_configuration;
	_value;
	
	constructor(id) {
		this._id = id;
	}
	
	get id() {
		return this._id;
	}
	
	get configuration() {
		if (!this._configuration) {
			const configuration = this.catalog.configuration[this.id];
			if (!configuration) throw new UnknownError('catalog field', this.id, this.catalog.configuration);
			this._configuration = configuration;
		}
		
		return this._configuration;
	}
	
	get catalog() {
		return requestContext.get().catalog;
	}
	
	async populate() {
		throw new Error('Cannot create instance of CatalogField');
	}
	
	async getValue() {
		if (this._value === undefined) await this.populate();
		
		return this._value;
	}
}

module.exports = CatalogField;
