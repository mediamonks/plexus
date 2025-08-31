import azure from '../services/azure';
import openai from '../services/openai';
import google from '../services/google';
import config from '../utils/config';
import History from '../utils/History';

const PLATFORMS = {
	azure,
	openai,
	google,
};

type Configuration = {
	platform: string;
	model: string;
	temperature?: number;
};

async function query(prompt: string, { systemInstructions, temperature, history, structuredResponse, files }: {
	systemInstructions?: string;
	temperature?: number;
	history?: History;
	structuredResponse?: any;
	files?: any[];
}): Promise<any> {
	const { platform, model } = config.get() as Configuration;
	temperature ??= config.get('temperature') as Configuration['temperature'];
	
	if (!PLATFORMS[platform]) throw new Error(`Invalid platform selection: "${platform}". Must be either "google", "openai" or "azure".`);
	
	return PLATFORMS[platform].query(prompt, {
		systemInstructions,
		temperature,
		history,
		structuredResponse,
		model,
		files,
	});
}

export default { query };
