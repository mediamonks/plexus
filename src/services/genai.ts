import fs from 'node:fs';
import { GoogleGenAI, Content, Part } from '@google/genai';
import mimeTypes from 'mime-types';
import config from '../utils/config';
import History from '../utils/History';

type Configuration = {
	projectId: string;
	location: string;
	embeddingLocation: string;
	model: string;
};

const { projectId: project, location, embeddingLocation } = config.get('genai', true) as Configuration;

const { GOOGLE_GENAI_API_KEY } = process.env;

let googleGenAi: GoogleGenAI;
if (GOOGLE_GENAI_API_KEY) {
	googleGenAi = new GoogleGenAI({ apiKey: GOOGLE_GENAI_API_KEY });
} else {
	googleGenAi = new GoogleGenAI({
		vertexai: true,
		project,
		location
	});
}

let last: number;

async function query(query: string, {
	systemInstructions,
	history = new History(),
	temperature,
	maxTokens = null,
	datastoreIds = [],
	structuredResponse = false,
	model,
	files = [],
}: {
	systemInstructions?: string;
	history?: History;
	temperature?: number;
	maxTokens?: number | null;
	datastoreIds?: string[];
	structuredResponse?: boolean;
	model?: string;
	files?: string[];
}): Promise<string> {
	const parts: Part[] = [{ text: query }];
	
	for (const file of files) {
		if (file.toLowerCase().startsWith('gs://')) {
			parts.push({ text: file });
		} else {
			parts.push({
				inlineData: {
					mimeType: mimeTypes.lookup(file),
					data: await fs.promises.readFile(file, { encoding: 'base64' }),
				},
			});
		}
	}
	
	const contents: Content[] = [
		...history.toVertexAi(),
		{ role: 'user', parts }
	];
	
	let tools = [];
	for (const datastoreId of datastoreIds) {
		const datastore = `projects/${config.get('genai/projectId', true)}/locations/${config.get('genai/datastoreLocation', true) ?? 'global'}/collections/default_collection/dataStores/${datastoreId}`;
		
		tools.push({
			retrieval: {
				vertexAiSearch: {
					datastore,
				},
			},
		});
	}
	
	model ??= config.get('genai/model') as string;
	
	if (last) {
		const delay = config.get('genai/quotaDelayMs', true) as number ?? 0;
		while (last + delay > performance.now()) await new Promise(resolve => setTimeout(resolve, last + delay - performance.now()));
		last = performance.now();
	}
	
	const result = await googleGenAi.models.generateContent({
		model,
		contents,
		config: {
			systemInstruction: systemInstructions,
			temperature,
			maxOutputTokens: maxTokens && Math.min(maxTokens, 8192),
			responseMimeType: structuredResponse && 'application/json',
			tools,
		},
	});

	return result.candidates[0].content.parts[0].text;
}

async function generateEmbeddings(text: string, model?: string, taskType?: string): Promise<number[]> {
	model ??= config.get('genai/embeddingModel') as string;
	
	let embeddingClient;
	if (!embeddingLocation || embeddingLocation === location) {
		embeddingClient = googleGenAi;
	} else {
		embeddingClient = new GoogleGenAI({
			vertexai: true,
			project,
			location: embeddingLocation
		});
	}
	
	if (last) {
		const delay = config.get('genai/quotaDelayMs', true) as number ?? 0;
		while (last + delay > performance.now()) await new Promise(resolve => setTimeout(resolve, last + delay - performance.now()));
		last = performance.now();
	}
	
	const result = await embeddingClient.models.embedContent({
		model,
		contents: text,
		config: {
			taskType,
		}
	});

	return result.embeddings[0].values;
}

async function generateQueryEmbeddings(text: string, model?: string): Promise<number[]> {
	return await generateEmbeddings(text, model, 'RETRIEVAL_QUERY');
}

async function generateDocumentEmbeddings(text: string, model?: string): Promise<number[]> {
	return await generateEmbeddings(text, model, 'RETRIEVAL_DOCUMENT');
}

export default {
	query,
	generateQueryEmbeddings,
	generateDocumentEmbeddings,
};
