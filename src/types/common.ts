import { Type } from '@google/genai';
import Configuration from './Configuration';

export function staticImplements<TInterface>() {
	return <TConstructor extends TInterface>(constructor: TConstructor) => constructor;
}

export type JsonPrimitive = string | number | boolean | null;
export type JsonArray = JsonField[];
export type JsonField = JsonPrimitive | JsonArray | JsonObject;
export type JsonObject = { [key: string]: JsonField };

export type ValueOf<T> = T[keyof T];

export type SpreadSheetData = { sheets: { title: string; rows: any[] }[] };

export type InvokePayload = {
	threadId?: string;
	config?: Configuration;
	fields?: JsonObject;
};

export type VectorDBRecord = JsonObject & {
	_id: string;
	_source: string;
	_vector: number[];
}

// TODO make more generic
export type LLMTool = {
	description: string;
	parameters: {
		type: Type;
		properties: Record<string, {
			type: Type;
			description: string;
		}>;
		required: string[];
	},
	handler: (query: string) => Promise<JsonObject[]>;
};
