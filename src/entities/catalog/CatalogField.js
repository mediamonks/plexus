const UnknownError = require('../../utils/UnknownError');

class CatalogField {
	_catalog;
	_configuration;
	_value;
	
	constructor(id, catalog) {
		this._id = id;
		this._catalog = catalog;
	}
	
	static TYPE = {
		INPUT: 'input',
		OUTPUT: 'output',
		DATA: 'data'
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
		return this._catalog;
	}
	
	get type() {
		return this.configuration.type;
	}
	
	get example() {
		return this.configuration.example;
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
