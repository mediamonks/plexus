const DataSources = require('./DataSources');
const dataSources = require('../../config/data-sources.json');

async function ingest(id) {
	const { source, type } = dataSources[id];
	
	if (source.startsWith(':')) {
		if (type.split(':')[1] === 'vector') throw new Error('Dynamic source not supported for vector type data sources');
		console.warn(`Not ingesting data source "${id}": dynamic source`);
		return;
	}
	
	await DataSources.write(id, await DataSources.read(id));
}

async function ingestAll(namespace) {
	await Promise.all(Object.keys(dataSources).map(id => {
		if (namespace && dataSources[id].namespace !== namespace) return;
		
		return ingest(id);
	}));
}

module.exports = { ingest, ingestAll };
