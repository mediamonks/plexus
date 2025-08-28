import azure from '../services/azure';
import openai from '../services/openai';
import google from '../services/google';
import config from '../utils/config';

const PLATFORMS = {
	azure,
	openai,
	google,
};

async function query(prompt: string, { systemInstructions, temperature, history, structuredResponse, files }: {
	systemInstructions?: string;
	temperature?: number;
	history?: any[];
	structuredResponse?: any;
	files?: any[];
}): Promise<any> {
	const { platform, model } = config.get();
	temperature ??= config.get('temperature');
	
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
