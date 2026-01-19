import Configuration from './Configuration';
import DataSource from '../entities/data-sources/DataSource';
import DataSourceItem from '../entities/data-sources/origin/DataSourceItem';

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
};

type ToolCallSchemaPrimitive = {
	type: 'string' | 'number' | 'integer' | 'boolean';
	description: string;
};

type ToolCallSchemaObject = {
	type: 'object';
	properties: Record<string, ToolCallSchemaProperty>;
	required: string[];
	description?: string;
};

type ToolCallSchemArray = {
	type: 'array';
	items: ToolCallSchemaProperty;
	description?: string;
};

export type ToolCallSchemaProperty = ToolCallSchemaPrimitive | ToolCallSchemaObject | ToolCallSchemArray;

export type ToolCallSchema = {
	description: string;
	parameters: ToolCallSchemaObject;
};

export type Tool = DataSource;

export type ToolCall = {
	id: string;
	toolName: string;
	arguments: Record<string, unknown>;
};

export type ToolCallParameters = Record<string, JsonField>;

export type ToolCallResult = {
	message?: string;
	data?: JsonObject[];
	files?: DataSourceItem<string>[];
};
