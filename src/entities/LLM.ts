import CustomError from './error-handling/CustomError';
import azure from '../services/azure';
import openai from '../services/openai';
import genai from '../services/genai';
import config from '../utils/config';
import History from '../utils/History';

const PLATFORMS = {
	azure,
	openai,
	google: genai,
};

type Configuration = {
	platform: string;
	model: string;
	temperature?: number;
};

export default class LLM {
	public static async query(prompt: string, { instructions, temperature, history, structuredResponse, files }: {
		instructions?: string;
		temperature?: number;
		history?: History;
		structuredResponse?: boolean;
		files?: any[];
	}): Promise<string> {
		const { platform, model } = config.get() as Configuration;
		temperature ??= config.get('temperature') as Configuration['temperature'];
		
		if (!PLATFORMS[platform]) throw new CustomError(`Invalid platform selection: "${platform}". Must be either "google", "openai" or "azure".`);
		
		return PLATFORMS[platform].query(prompt, {
			systemInstructions: instructions,
			temperature,
			history,
			structuredResponse,
			model,
			files,
		});
	}
};
