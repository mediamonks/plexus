import fs from 'node:fs';
import { GoogleGenAI, Content, Part } from '@google/genai';
import mimeTypes from 'mime-types';
import ILLMPlatform, { QueryOptions } from './ILLMPlatform';
import Config from '../../core/Config';
import { staticImplements } from '../../types/common';
import History from '../../core/History';

const { GOOGLE_GENAI_API_KEY } = process.env;

@staticImplements<ILLMPlatform>()
export default class GoogleLLMPlatform {
	public static Configuration: {
		projectId: string;
		location: string;
		model: string;
		embeddingLocation: string;
		embeddingModel: string;
		quotaDelayMs: number;
	};
	
	private static _client: GoogleGenAI;
	private static _embeddingClient: GoogleGenAI;
	private static _lastQuery: number;
	private static _cachedEmbeddings: Record<string, Record<string, Record<string, number[]>>> = {};
	
	public static async query(query: string, {
		systemInstructions,
		history = new History(),
		temperature,
		maxTokens,
		structuredResponse,
		model,
		files
	}: QueryOptions = {}): Promise<string> {
		const fileParts = await this.getFileParts(files);
		
		const parts: Part[] = [
			{ text: query },
			...fileParts,
		];
		
		const contents: Content[] = [
			...history.toVertexAi(),
			{ role: 'user', parts },
		];
		
		model ??= this.configuration.model;
		
		await this.quotaDelay();
		
		const result = await this.client.models.generateContent({
			model,
			contents,
			config: {
				systemInstruction: systemInstructions,
				temperature,
				maxOutputTokens: maxTokens,
				responseMimeType: structuredResponse && 'application/json',
			},
		});
		
		return result.candidates[0].content.parts[0].text;
	}
	
	public static async generateQueryEmbeddings(text: string, model?: string): Promise<number[]> {
		return await this.generateEmbeddings(text, model, 'RETRIEVAL_QUERY');
	}
	
	public static async generateDocumentEmbeddings(text: string, model?: string): Promise<number[]> {
		return await this.generateEmbeddings(text, model, 'RETRIEVAL_DOCUMENT');
	}
	
	public static get embeddingModel(): string {
		return this.configuration.embeddingModel;
	}
	
	private static get configuration(): typeof GoogleLLMPlatform.Configuration {
		return Config.get('genai', { includeGlobal: true });
	}
	
	private static async generateEmbeddings(input: string, model?: string, taskType?: string): Promise<number[]> {
		model ??= this.embeddingModel;
		
		const cachedEmbeddings = this._cachedEmbeddings[model]?.[taskType]?.[input];
		
		if (cachedEmbeddings) return cachedEmbeddings;
		
		await this.quotaDelay();
		
		const result = await this.embeddingClient.models.embedContent({
			model,
			contents: input,
			config: { taskType },
		});
		
		const vector = result.embeddings[0].values;
		
		this._cachedEmbeddings[model] ??= {};
		this._cachedEmbeddings[model][taskType] ??= {};
		this._cachedEmbeddings[model][taskType][input] = vector;
		
		return vector;
	}
	
	private static get client(): GoogleGenAI {
		if (this._client) return this._client;
		
		const {
			projectId: project,
			location
		} = this.configuration;
		
		if (project && location) {
			return this._client = new GoogleGenAI({
				vertexai: true,
				project,
				location
			});
		}
		
		return this._client = new GoogleGenAI({ apiKey: GOOGLE_GENAI_API_KEY });
	}
	
	private static get embeddingClient(): GoogleGenAI {
		if (this._embeddingClient) return this._embeddingClient;
		
		const {
			projectId: project,
			location,
			embeddingLocation,
		} = this.configuration;
		
		if (embeddingLocation === location) return this._embeddingClient = this.client;
		
		if (project && embeddingLocation) {
			return this._embeddingClient = new GoogleGenAI({
				vertexai: true,
				project,
				location: embeddingLocation
			});
		}
		
		return this._embeddingClient = new GoogleGenAI({ apiKey: GOOGLE_GENAI_API_KEY });
	}
	
	private static async getFileParts(files: string[]): Promise<Part[]> {
		return await Promise.all(files.map(async file => {
			if (file.toLowerCase().startsWith('gs://')) return { text: file };
			
			return {
				inlineData: {
					mimeType: mimeTypes.lookup(file) as string,
					data: await fs.promises.readFile(file, { encoding: 'base64' }),
				},
			};
		}));
	}
	
	private static async quotaDelay(): Promise<void> {
		if (this._lastQuery) {
			const delay = this.configuration.quotaDelayMs ?? 0;
			while (performance.now() < this._lastQuery + delay)
				await new Promise(resolve =>
					setTimeout(resolve, this._lastQuery + delay - performance.now())
				);
		}
		this._lastQuery = performance.now();
	}
};
