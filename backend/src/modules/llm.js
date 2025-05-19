const platforms = {
	azure: require('../services/azure'),
	openai: require('../services/openai'),
	google: require('../services/vertexai'),
};
const config = require('../utils/config');

async function query(prompt, { systemInstructions, temperature, history, structuredResponse }) {
	const { platform, model } = config.get();
	temperature ??= config.get('temperature');
	
	if (!platforms[platform]) throw new Error(`Invalid platform selection: "${platform}". Must be either "google", "openai" or "azure".`);
	
	return platforms[platform].query(prompt, {
		systemInstructions,
		temperature,
		history,
		structuredResponse,
		model,
	});
}

module.exports = { query };
