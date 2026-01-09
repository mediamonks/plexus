import fs from 'node:fs/promises';
import { GoogleGenAI, Content, Part, FunctionDeclaration, Type } from '@google/genai';
import ILLMPlatform, { QueryOptions } from './ILLMPlatform';
import LLMPlatform from './LLMPlatform';
import Debug from '../../core/Debug';
import Profiler from '../../core/Profiler';
import DataSourceItem from '../../entities/data-sources/origin/DataSourceItem';
import CustomError from '../../entities/error-handling/CustomError';
import GoogleCloudStorageDataSourceItem from '../../entities/data-sources/origin/GoogleCloudStorageDataSourceItem';
import { staticImplements } from '../../types/common';

const { GOOGLE_GENAI_API_KEY } = process.env;

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
		projectId: string;
		location: string;
		model: string;
		embeddingLocation: string;
		embeddingModel: string;
		outputTokens?: number;
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
		model,
		temperature,
		outputTokens,
		structuredResponse,
		files = [],
		tools = {},
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

		const toolNames = Object.keys(tools);
		const functionDeclarations = toolNames.map(toolName => ({
			name: toolName,
			description: tools[toolName].description,
			parameters: tools[toolName].parameters,
		}));
		
		let response, finalResponse;
		let loopCount = 0;
		do {
			if (loopCount++ > 10) throw new CustomError('Tool loop limit exceeded');
			
			Debug.log('Querying model', 'GoogleLLMPlatform');
			response = await Profiler.run(async () =>  this.client.models.generateContent({
				model,
				contents,
				config: {
					systemInstruction: instructions,
					temperature,
					maxOutputTokens: outputTokens,
					responseMimeType: structuredResponse ? 'application/json' : undefined,
					tools: (toolNames.length && [{ functionDeclarations }]) || [],
				},
			}), 'GoogleLLMPlatform.query');
			
			const candidate = response.candidates[0];
			const responseParts = candidate.content.parts;
			const functionCallParts = responseParts.filter(part => part.functionCall);
			
			if (functionCallParts.length) {
				contents.push(candidate.content);
				
				const functionResponseParts = await Promise.all(functionCallParts.map(async part => {
					Debug.dump('tool call', part.functionCall);
					const { id, name, args } = part.functionCall;
					if (!tools[name]) throw new CustomError(`Tool "${name}" not found`);
					Debug.log(`Executing tool "${name}"`, 'GoogleLLMPlatform');
					
					try {
						const toolResult = await tools[name].handler(args);
						Debug.dump('tool call result', toolResult);
						return { functionResponse: { id, name: name, response: { output: toolResult } } };
					} catch (error) {
						Debug.dump('tool call error', error.toString());
						return { functionResponse: { id, name: name, response: { error: error.toString() } } };
					}
				}));
				
				contents.push({ role: 'user', parts: functionResponseParts });
				Debug.dump('chat contents', contents);
			} else {
				finalResponse = responseParts.map(part => part.text).join('');
			}
		} while (!finalResponse);
		
		return finalResponse;
	}
	
	public static async generateQueryEmbeddings(text: string, model?: string): Promise<number[]> {
		return await this.generateEmbeddings(text, model, 'RETRIEVAL_QUERY');
	}
	
	public static async generateDocumentEmbeddings(text: string, model?: string): Promise<number[]> {
		return await this.generateEmbeddings(text, model, 'RETRIEVAL_DOCUMENT');
	}
	
	protected static get configuration(): typeof GoogleLLMPlatform.Configuration {
		return super.configuration as typeof GoogleLLMPlatform.Configuration;
	}
	
	private static get functions(): FunctionDeclaration[] {
		return [{
			name: `query_datasource`,
			description: `Query data source`,
			parameters: {
				type: Type.OBJECT,
				properties: {
					dataSourceId: {
						type: Type.STRING,
						description: 'The data source ID'
					},
					query: {
						type: Type.STRING,
						description: 'The query'
					}
				},
				required: ['dataSourceId', 'query']
			}
		}];
	}
	
	private static async generateEmbeddings(input: string, model?: string, taskType?: string): Promise<number[]> {
		model ??= this.embeddingModel;
		
		const cachedEmbeddings = this._cachedEmbeddings[model]?.[taskType]?.[input];
		
		if (cachedEmbeddings) return cachedEmbeddings;
		
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
	
	private static async createFileParts(files: DataSourceItem<unknown, unknown>[]): Promise<Part[]> {
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
