import Agent from '../entities/agents/Agent';
import Catalog from '../entities/catalog/Catalog';
import DataSources from '../entities/data-sources/DataSources';

export function staticImplements<T>() {
	return <U extends T>(constructor: U) => constructor;
}

export type JsonPrimitive = string | number | boolean | null;
export type JsonArray = JsonField[];
export type JsonField = JsonPrimitive | JsonArray | JsonObject;
export type JsonObject = { [key: string]: JsonField };

export type ValueOf<T> = T[keyof T];

export type SpreadSheet = { sheets: { title: string; rows: any[] }[] };

export type RequestPayload = {
	threadId?: string;
	config?: JsonObject;
	fields?: JsonObject;
};

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

export type Configuration = {
	projectId?: string;
	location?: string;
	platform?: string;
	embeddingPlatform?: string;
	waitForThreadUpdate?: boolean;
	tempPath?: string;
	output?: string[];
	postback?: {
		url: string;
		headers?: Record<string, string>;
	};
	instructionsPath?: string;
	agents?: Record<string, typeof Agent.Configuration>;
	azure?: {
		apiVersion: string;
		deploymentName: string;
		baseUrl: string;
	};
	catalog?: typeof Catalog.Configuration;
	drive?: {
		tempFolderId: string;
	};
	'data-sources'?: typeof DataSources.Configuration;
	firestore?: {
		databaseId: string;
		ignoreUndefinedProperties?: boolean;
	};
	genai?: {
		projectId?: string;
		location?: string;
		model?: string;
		embeddingModel?: string;
		embeddingLocation?: string;
		quotaDelayMs?: number;
		safetySettings?: {
			category: string;
			threshold: string;
		}[];
	};
	'input-fields'?: Record<string, { id: string; label: string; description: string; }>;
	lancedb?: {
		databaseUri: string;
		rateLimitDelayMs?: number;
	};
	openai?: {
		model: string;
		apiVersion: string;
		embeddingModel: string;
	};
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
};
