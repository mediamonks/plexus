const DataSources = require('../entities/data-sources/DataSources');

async function ingest(namespace) {
	await DataSources.ingest(namespace);
}

module.exports = ingest;
