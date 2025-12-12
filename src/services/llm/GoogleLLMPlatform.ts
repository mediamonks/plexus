import fs from 'node:fs/promises';
import { GoogleGenAI, Content, Part } from '@google/genai';
import ILLMPlatform, { QueryOptions } from './ILLMPlatform';
import Config from '../../core/Config';
import { staticImplements } from '../../types/common';
import DataSourceItem from '../../entities/data-sources/origin/DataSourceItem';
import GoogleCloudStorageDataSourceItem from '../../entities/data-sources/origin/GoogleCloudStorageDataSourceItem';
import Profiler from '../../core/Profiler';

const { GOOGLE_GENAI_API_KEY } = process.env;

@staticImplements<ILLMPlatform>()
export default class GoogleLLMPlatform {
	public static readonly supportedMimeTypes: Set<string> = new Set([
		'application/json',
		'application/pdf',
		'image/jpeg',
		'image/png',
		'text/plain',
	]);
	
	public static readonly Configuration: {
		projectId: string;
		location: string;
		model: string;
		embeddingLocation: string;
		embeddingModel: string;
		quotaDelayMs: number;
		apiKey: string;
		useVertexAi: boolean;
	};
	
	private static _client: GoogleGenAI;
	private static _embeddingClient: GoogleGenAI;
	private static _lastQuery: number;
	private static _cachedEmbeddings: Record<string, Record<string, Record<string, number[]>>> = {};
	
	public static async query(query: string, {
		instructions,
		history,
		temperature,
		maxTokens,
		structuredResponse,
		model,
		files = [],
	}: QueryOptions = {}): Promise<string> {
		const fileParts = await Profiler.run(() => this.createFileParts(files), 'GoogleLLMPlatform.createFileParts');
		
		const parts: Part[] = [
			{ text: query },
			...fileParts,
		];
		
		const contents: Content[] = [
			...history.toGemini(),
			{ role: 'user', parts },
		];
		
		model ??= this.configuration.model;
		
		await Profiler.run(() => this.quotaDelay(), 'GoogleLLMPlatform.quotaDelay');
		
		const response = await Profiler.run(async () =>  this.client.models.generateContent({
			model,
			contents,
			config: {
				systemInstruction: instructions,
				temperature,
				maxOutputTokens: maxTokens,
				responseMimeType: structuredResponse && 'application/json',
			},
		}), 'GoogleLLMPlatform.query');
		
		return response.candidates[0].content.parts[0].text;
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
			location,
			apiKey,
			useVertexAi,
		} = this.configuration;
		
		if (useVertexAi) {
			return this._client = new GoogleGenAI({
				vertexai: true,
				project,
				location
			});
		}
		
		return this._client = new GoogleGenAI({ apiKey: apiKey ?? GOOGLE_GENAI_API_KEY });
	}
	
	private static get embeddingClient(): GoogleGenAI {
		if (this._embeddingClient) return this._embeddingClient;
		
		const {
			projectId: project,
			location,
			embeddingLocation,
			apiKey,
			useVertexAi,
		} = this.configuration;
		
		if (embeddingLocation === location) return this._embeddingClient = this.client;
		
		if (useVertexAi) {
			return this._embeddingClient = new GoogleGenAI({
				vertexai: true,
				project,
				location: embeddingLocation
			});
		}
		
		return this._embeddingClient = new GoogleGenAI({ apiKey: apiKey ?? GOOGLE_GENAI_API_KEY });
	}
	
	private static async createFileParts(files: DataSourceItem<unknown, unknown>[]): Promise<Part[]> {
		return await Promise.all(files.map(async item => {
			if (item instanceof GoogleCloudStorageDataSourceItem && (await item.size) <= 52428800 * 1024) return {
				fileData: {
					fileUri: item.uri,
					mimeType: item.mimeType,
				}
			};
			
			return {
				inlineData: {
					mimeType: item.mimeType,
					data: await item.toBase64(),
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
