const CatalogField = require('./CatalogField');
const DataSources = require('../data-sources/DataSources');
const Debug = require('../../utils/Debug');

class DataSourceCatalogField extends CatalogField {
	get dataSourceId() {
		if (!this.configuration.dataSource) throw new Error(`Missing 'dataSource' property for data field "${this.id}"`);
		
		return this.configuration.dataSource;
	}
	
	get inputField() {
		return this.configuration.input;
	}
	
	get filter() {
		return this.configuration.filter;
	}
	
	get queryParameters() {
		return {
			limit: this.configuration.limit,
			fields: this.configuration.fields,
			sort: this.configuration.sort,
		};
	}
	
	get dataSource() {
		return DataSources.get(this.dataSourceId);
	}
	
	async populate() {
		Debug.log(`Populating data source field "${this.id}"`, 'Catalog');
		
		const promises = [];
		
		let input;
		let filter = this.filter;
		
		if (this.inputField) {
			promises.push(
				this.catalog.get(this.inputField).getValue()
					.then(value => input = value)
			);
		}
		
		if (filter) {
			for (const key in filter) {
				promises.push(
					this.catalog.get(filter[key]).getValue()
						.then(value => filter[key] = value)
				);
			}
		}
		
		await Promise.all(promises);
		
		this._value = this.dataSource.query({ input, filter, ...this.queryParameters });
	}
}

module.exports = DataSourceCatalogField;
