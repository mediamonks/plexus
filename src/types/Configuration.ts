import Agent from '../entities/agents/Agent';
import Catalog from '../entities/catalog/Catalog';
import DataSources from '../entities/data-sources/DataSources';
import AzureLLMPlatform from '../services/llm/AzureLLMPlatform';
import GoogleLLMPlatform from '../services/llm/GoogleLLMPlatform';
import LLM from '../services/llm/LLM';
import LocalLLMPlatform from '../services/llm/LocalLLMPlatform';
import OpenAILLMPlatform from '../services/llm/OpenAILLMPlatform';

export type RouteMethodConfiguration = {
	summary: string;
	description: string;
	handler: string;
};

export type RouteArrayField = {
	type: 'array';
	items: RouteField[];
};

export type RouteObjectField = {
	type: 'object';
	properties: Record<string, RouteField>;
};

export type RouteStringField = {
	type: 'string';
	format?: 'uuid';
	enum?: string[];
	default?: string;
};

export type RouteField = RouteStringField | {
	type: 'number' | 'boolean';
	description?: string;
} | RouteArrayField | RouteObjectField;

type Configuration = {
	inherit?: string;
	projectId?: string;
	location?: string;
	platform?: string;
	embeddingPlatform?: string;
	waitForThreadUpdate?: boolean;
	tempPath?: string;
	debug?: boolean;
	profiling?: boolean;
	dataDumps?: boolean;
	output?: string[];
	postback?: {
		url: string;
		headers?: Record<string, string>;
	};
	instructionsPath?: string;
	agents?: Record<string, typeof Agent.Configuration>;
	azure?: typeof AzureLLMPlatform.Configuration;
	catalog?: typeof Catalog.Configuration;
	drive?: {
		tempFolderId: string;
		tempPath?: string;
	};
	'data-sources'?: typeof DataSources.Configuration;
	firestore?: {
		databaseId: string;
		ignoreUndefinedProperties?: boolean;
	};
	genai?: typeof GoogleLLMPlatform.Configuration;
	'input-fields'?: Record<string, { id: string; label: string; description: string; }>;
	lancedb?: {
		databaseUri: string;
		rateLimitDelayMs?: number;
	};
	llm?: typeof LLM.Configuration;
	'local-llm'?: typeof LocalLLMPlatform.Configuration;
	openai?: typeof OpenAILLMPlatform.Configuration;
	routes?: Record<string, {
		parameters?: Record<string, RouteField>;
		methods: {
			get?: RouteMethodConfiguration & {
				response: Record<string, RouteField>;
			};
			post?: RouteMethodConfiguration & {
				payload: Record<string, RouteField>;
			};
		}
	}>;
	storage?: {
		bucket: string;
	};
	vectordb?: {
		engine?: 'lancedb' | 'pgvector';
	};
};

export default Configuration;
