const CatalogField = require('./CatalogField');
const Agents = require('../agents/Agents');
const Debug = require('../../utils/Debug');

class OutputCatalogField extends CatalogField {
	get outputField() {
		if (!this.configuration.field) throw new Error(`Missing 'field' property for output field "${this.id}"`);
		
		return this.configuration.field;
	}
	
	get agentId() {
		if (!this.configuration.agent) throw new Error(`Missing 'agent' property for output field "${this.id}"`);
		
		return this.configuration.agent;
	}
	
	get required() {
		return !!this.configuration.required;
	}
	
	async populate() {
		Debug.log(`Populating output field "${this.id}"`, 'Catalog');
		
		const result = await Agents.get(this.agentId, this.catalog).invoke();
		
		const value = result[this.outputField];
		
		if (value === undefined) throw new Error(`Agent "${this.agentId}" failed to output field "${this.outputField}"`);
		
		this._value = value;
	}
}

module.exports = OutputCatalogField;
