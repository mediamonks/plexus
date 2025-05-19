const tasks = require('../services/tasks');

module.exports = async function brandSetup({ brandId }, { config }) {
	await tasks.delegate('brand.setup', [brandId, config]);
}
