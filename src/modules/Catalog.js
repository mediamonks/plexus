const fs = require('node:fs/promises');
const agents = require('./agents');
const DataSources = require('./DataSources');
const vectordb = require('./vectordb');
const storage = require('../services/storage');
const jsonl = require('../utils/jsonl');
const requestContext = require('../utils/request-context');
const catalogDefinition = require('../../config/catalog.json');
const inputFields = require('../../config/input-fields.json');
const dataSources = require('../../config/data-sources.json');

module.exports = class Catalog {
	fields = {};
	
	populate = {
		input: async function ({ field, required }) {
			let value = requestContext.get().payload[field];
			if (required && value === undefined) throw new Error(`Input field "${field}" is required`);
			if (value === undefined) return;
			const fieldValues = inputFields[field];
			if (fieldValues) {
				if (!(value in fieldValues)) throw new Error(`Unknown value "${value}" for input field "${field}". Must be one of ${Object.keys(fieldValues).join(', ')}`);
				value = fieldValues[value].description ?? fieldValues[value].label;
			}
			return value;
		},
		
		output: async function ({ agent, field }) {
			const result = await agents.get(agent).invoke();
			return result[field];
		},
		
		search: async ({ input, dataSource, limit }) => {
			const text = await this.get(input);
			const embeddings = await vectordb.generateQueryEmbeddings(text);
			const result = await vectordb.search(dataSource, embeddings, { limit, fields: ['text'] });
			return result.map(item => item['text']);
		},
		
		vectorQuery: async ({ input, dataSource, limit, filter, fields }) => {
			const text = await this.get(input);
			const embeddings = await vectordb.generateQueryEmbeddings(text);
			for (const key in filter) {
				filter[key] = await this.get(filter[key]);
			}
			return vectordb.search(dataSource, embeddings, { limit, filter, fields });
		},
		
		query: async ({ dataSource, filter, limit, fields, sort }) => {
			const data = DataSources.get(dataSource);
			const result = [];
			for await (let item of data) {
				let include = true;
				for (const key in filter) {
					const value = await this.get(filter[key]);
					include = include && (item[key] === value);
					if (!include) break;
				}
				
				if (!include) continue;
				
				if (fields) item = fields.reduce((resultItem, field) => ({ ...resultItem, [field]: item[field] }), {});
				
				result.push(item);
				
				// TODO perhaps select randomly if not sorting?
				if (!sort && result.length >= limit) break;
			}
			
			if (sort) result.sort((a, b) => b[sort] - a[sort]);
			
			return result.slice(0, limit ?? 3);
		},
		
		//TODO rename to literal/verbatim/data...? it's not necessarily text
		data: async ({ dataSource }) => {
			return DataSources.get(dataSource);
		},
	}
	
	populateField(field) {
		const fieldDefinition = catalogDefinition[field];
		const populateFunction = this.populate[fieldDefinition.type];
		
		if (!populateFunction) throw new Error(`Unknown type "${fieldDefinition.type}" for context field "${field}". Must be one of ${Object.keys(this.populate).join(', ')}`);
		
		return new Promise((resolve, reject) => {
			setTimeout(async () => {
				try {
					console.debug('[Catalog] Populating', fieldDefinition.type, 'field:', field);
					const value = await populateFunction(fieldDefinition).catch(error => console.error(error));
					// console.debug('[Catalog]', field, '=', typeof value === 'string' ? value.split('\n')[0] + (value.split('\n').length > 1 ? '...' : '') : value);
					console.debug('[Catalog]', field, '=', typeof value, value ? value.length : '');
					resolve(value);
				} catch (error) {
					reject(error);
				}
			}, 0);
		});
	}
	
	get(field) {
		return Promise.resolve(this.fields[field] ??= this.populateField(field));
	}
}
