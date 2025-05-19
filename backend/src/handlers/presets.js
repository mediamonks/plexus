module.exports = async function generateCopy() {
	return Object.values(require('../../data/copy-generation-presets.json'));
};
