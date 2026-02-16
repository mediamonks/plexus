import fs from 'node:fs/promises';
import { GoogleGenAI, Content, Part } from '@google/genai';
import ILLMPlatform, { QueryOptions } from './ILLMPlatform';
import LLMPlatform from './LLMPlatform';
import Debug from '../../core/Debug';
import Profiler from '../../core/Profiler';
import DataSourceItem from '../../entities/data-sources/origin/DataSourceItem';
import GoogleCloudStorageDataSourceItem from '../../entities/data-sources/origin/GoogleCloudStorageDataSourceItem';
import { staticImplements } from '../../types/common';

const GOOGLE_GENAI_API_KEY = process.env.GOOGLE_GENAI_API_KEY;

@staticImplements<ILLMPlatform>()
export default class GoogleLLMPlatform extends LLMPlatform {
	protected static readonly configModuleName: 'genai' = 'genai';
	
	public static readonly supportedMimeTypes: Set<string> = new Set([
		'application/json',
		'application/pdf',
		'image/jpeg',
		'image/png',
		'text/plain',
	]);
	
	public static readonly Configuration: {
		model?: string;
		embeddingModel?: string;
		projectId?: string;
		location?: string;
		embeddingLocation?: string;
		outputTokens?: number;
		quotaDelayMs?: number;
		timeoutMs?: number;
		retries?: number;
		apiKey?: string;
		useVertexAi?: boolean;
	};
	
	private static _client: GoogleGenAI;
	private static _embeddingClient: GoogleGenAI;
	private static _lastQuery: number;
	private static _cachedEmbeddings: Record<string, Record<string, Record<string, number[]>>> = {};
	private static readonly TRANSIENT_ERROR_CODES: Set<string> = new Set(['UND_ERR_HEADERS_TIMEOUT', 'ECONNRESET', 'ETIMEDOUT']);
	
	public static async query(query: string, {
		instructions,
		history,
		model,
		temperature,
		outputTokens,
		schema,
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
		
		model ??= this.model;
		outputTokens ??= this.outputTokens;
		
		await Profiler.run(() => this.quotaDelay(), 'GoogleLLMPlatform.quotaDelay');
		
		Debug.dump('google llm call contents', contents);
		
		const response = await Profiler.run(async () => this.retry(() => this.client.models.generateContent({
			model,
			contents,
			config: {
				systemInstruction: instructions,
				temperature,
				maxOutputTokens: outputTokens,
				responseMimeType: schema ? 'application/json' : undefined,
				responseSchema: schema,
				httpOptions: this.configuration.timeoutMs ? { timeout: this.configuration.timeoutMs } : undefined,
			},
		})), 'GoogleLLMPlatform.query');
		
		const candidate = response.candidates[0];
		const responseParts = candidate.content.parts;
		
		return responseParts.map(part => part.text).join('');
	}
	
	public static async generateQueryEmbeddings(text: string, model?: string): Promise<number[]> {
		return await this.generateEmbeddings(text, model, 'RETRIEVAL_QUERY');
	}
	
	public static async generateDocumentEmbeddings(text: string, model?: string): Promise<number[]> {
		return await this.generateEmbeddings(text, model, 'RETRIEVAL_DOCUMENT');
	}
	
	public static async upload(dataSourceItem: DataSourceItem): Promise<void> {
		if (this.configuration.useVertexAi) return;
		
		Debug.log(`Uploading file "${dataSourceItem.fileName}" to File API`, 'GoogleLLMPlatform');
		
		const localFile = await dataSourceItem.getLocalFile();
		
		const file = await Profiler.run(() => this.client.files.upload({
			file: localFile,
			config: {
				name: dataSourceItem.id,
				displayName: dataSourceItem.fileName,
			},
		}), 'GoogleLLMPlatform.upload');
		
		Debug.log(`File "${dataSourceItem.fileName}" uploaded successfully: ${file.name}`, 'GoogleLLMPlatform');
	}
	
	protected static get configuration(): typeof GoogleLLMPlatform.Configuration {
		return super.configuration as typeof GoogleLLMPlatform.Configuration;
	}
	
	private static async generateEmbeddings(input: string, model?: string, taskType?: string): Promise<number[]> {
		model ??= this.embeddingModel;
		
		const cachedEmbeddings = this._cachedEmbeddings[model]?.[taskType]?.[input];
		
		if (cachedEmbeddings) return cachedEmbeddings;
		
		// TODO quota delay should be per model, or at least separate for embeddings and queries
		await this.quotaDelay();
		
		const result = await Profiler.run(() => this.embeddingClient.models.embedContent({
			model,
			contents: input,
			config: { taskType },
		}), 'GoogleLLMPlatform.generateEmbeddings');
		
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
		
		if (!embeddingLocation || embeddingLocation === location) return this._embeddingClient = this.client;
		
		if (useVertexAi) {
			return this._embeddingClient = new GoogleGenAI({
				vertexai: true,
				project,
				location: embeddingLocation
			});
		}
		
		return this._embeddingClient = new GoogleGenAI({ apiKey: apiKey ?? GOOGLE_GENAI_API_KEY });
	}
	
	private static async createFileParts(files: DataSourceItem[]): Promise<Part[]> {
		return await Promise.all(files.map(async item => {
			if (!this.supportedMimeTypes.has(item.mimeType)) {
				const localFile = await item.toPDF();
				return {
					inlineData: {
						mimeType: 'application/pdf',
						data: await fs.readFile(localFile, { encoding: 'base64' }),
					},
				};
			}
			
			if (item instanceof GoogleCloudStorageDataSourceItem && (await item.size) <= 52428800 * 1024) {
				const fileUri = this.configuration.useVertexAi ? item.uri : await item.getSignedUrl();
				return {
					fileData: {
						mimeType: item.mimeType,
						fileUri,
					}
				};
			}
			
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
			const waitTime = this._lastQuery + delay - performance.now();
			if (waitTime > 0) {
				await new Promise(resolve => setTimeout(resolve, waitTime));
				return this.quotaDelay();
			}
		}
		this._lastQuery = performance.now();
	}
	
	private static async retry<T>(fn: () => Promise<T>, attempt: number = 0): Promise<T> {
		try {
			return await fn();
		} catch (error) {
			const maxRetries = this.configuration.retries ?? 2;
			if (attempt >= maxRetries || !this.TRANSIENT_ERROR_CODES.has(error?.cause?.code)) throw error;
			
			Debug.log(`Transient error (${error.cause.code}), retrying (${attempt + 1}/${maxRetries})...`, 'GoogleLLMPlatform');
			return this.retry(fn, attempt + 1);
		}
	}
};
