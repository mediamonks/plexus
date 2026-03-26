import debounce from 'lodash.debounce';
import { v4 as uuid } from 'uuid';
import IAgent from './IAgent';
import IHasInstructions from '../IHasInstructions';
import Instructions from '../Instructions';
import Catalog from '../catalog/Catalog';
import DataSource from '../data-sources/DataSource';
import DataSources from '../data-sources/DataSources';
import DataSourceItem from '../data-sources/origin/DataSourceItem';
import VectorTargetDataSource from '../data-sources/target/VectorTargetDataSource';
import CustomError from '../error-handling/CustomError';
import UnsupportedError from '../error-handling/UnsupportedError';
import Console from '../../core/Console';
import Debug from '../../core/Debug';
import History from '../../core/History';
import Profiler from '../../core/Profiler';
import Status from '../../core/Status';
import LLM from '../../services/llm/LLM';
import {
	AgentOutputSchema,
	JsonField,
	JsonObject,
	ToolCallResult,
	ToolCallSchema
} from '../../types/common';
import { escapeUnicodeQuotes } from '../../utils/unicode-quotes';

type ToolCall = {
	id: string;
	toolName: string;
	arguments: Record<string, unknown>;
};

const TOOLS_TEMPLATE = `### **Tools**
You have access to the following tools. To perform a tool call, use the \`_tool_calls\` field in your response. When performing one or more tool calls, use the \`_status\` field to provide a short description of what you are doing.`;
// const INPUT_TEMPLATE = `### **Input Format (JSON)**`;
const OUTPUT_TEMPLATE = `### **Output Format (JSON)**
Output only JSON. Do **not** use markdown.`;

export default class Agent implements IAgent, IHasInstructions {
	public isReady: boolean = false;
	private _baseInstructions: Instructions;
	private _catalog: Catalog;
	private readonly _configuration: typeof Agent.Configuration;
	private readonly _context: Record<string, JsonField | DataSourceItem[]> = {};
	private readonly _id: string;
	private _invocation: Promise<JsonObject>;
	private _loaded: Promise<void>;
	private _ready: Promise<void>;
	private _temperature: number  = 0;
	private _toolCallSchemas: Record<string, ToolCallSchema> = {};
	private _outputSchema: AgentOutputSchema;
	
	static readonly Configuration: {
		readonly instructions: string;
		readonly context?: readonly string[];
		readonly required?: readonly string[];
		readonly useHistory?: boolean;
		readonly temperature?: number | string;
		readonly outputTokens?: number;
		readonly serialize?: string;
		readonly paginationRule?: string; // TODO not fully implemented
		readonly dataSources?: string[];
	};
	
	public constructor(id: string, configuration: typeof Agent.Configuration) {
		this._id = id;
		this._configuration = configuration;
		
		this._loaded = Promise.all([
			this.loadBaseInstructions(),
			this.loadToolCallSchemas(),
		]).then(() => {
			Debug.log(`Completed loading agent "${this.id}"`, 'Agent');
		});
	}
	
	public get id(): string {
		return this._id;
	}
	
	public get configuration(): typeof Agent.Configuration {
		return this._configuration as typeof Agent.Configuration;
	}
	
	public get instructions(): string {
		const instructions = [this.baseInstructions.toString()];
		
		const tools = Object.keys(this._toolCallSchemas).map(toolName => `
Name: ${toolName}
Description: ${this._toolCallSchemas[toolName].description}
Parameters schema:
${JSON.stringify(this._toolCallSchemas[toolName].parameters, undefined, 2)}`);

		if (tools.length) {
			instructions.push(`${TOOLS_TEMPLATE}\n${tools.join('\n\n')}`);
		}
		
		// const inputSchema = this.inputSchema;
		//
		// if (Object.keys(inputSchema).length) {
		// 	instructions.push(`${INPUT_TEMPLATE}\n${JSON.stringify(inputSchema, undefined, 2)}`);
		// }
		
		instructions.push(`${OUTPUT_TEMPLATE}\n${JSON.stringify(this.outputSchema, undefined, 2)}`);
		
		return instructions.join('\n\n');
	}
	
	public get catalog(): Catalog {
		return this._catalog;
	}
	
	protected get baseInstructions(): Instructions {
		return this._baseInstructions ??= new Instructions(this);
	}
	
	private get context(): readonly string[] {
		return this.configuration.context ?? [];
	}
	
	private get inputSchema(): JsonObject {
		const inputSchema: JsonObject = {};
		
		if (Object.keys(this._toolCallSchemas).length) {
			inputSchema._tool_call_results = [];
		}
		
		for (let fieldId of this.context) {
			let { example, inputField } = this.catalog.get(fieldId);

			if (!example) throw new CustomError(`Missing example for catalog field "${fieldId}"`);

			example = Catalog.resolveExample(example);

			if (this.configuration.serialize && fieldId === this.configuration.serialize[0]) {
				example = example[0];
				fieldId = this.configuration.serialize[1];
			}

			inputSchema[inputField] = example;
		}

		return inputSchema;
	}
	
	private get outputSchema(): AgentOutputSchema {
		if (this._outputSchema) return this._outputSchema;
		
		this._outputSchema = this.catalog.getAgentOutputSchema(this.id);
		
		if (Object.keys(this._toolCallSchemas).length) {
			this._outputSchema.properties._tool_calls = {
				type: 'array',
				description: 'tool calls go here',
				items: {
					type: 'object',
					properties: {
						id: { type: 'string', description: 'unique id to identify this tool call' },
						toolName: { type: 'string', description: 'name of the tool to call' },
						arguments: { type: 'object', description: 'arguments to pass to the tool' },
					},
				},
				example: [
					{
						id: 'some_unique_id',
						toolName: 'some_tool',
						arguments: { someArg: 'value', anotherArg: 123 }
					}
				]
			}
			this._outputSchema.properties._status = {
				type: 'string',
				description: 'short description of what the agent is doing',
				example: 'Looking up relevant documents'
			};
		}
		
		return this._outputSchema;
	}
	
	private get dataSources(): DataSource[] {
		if (!this.configuration.dataSources) return [];
		
		return this.configuration.dataSources.map(dataSourceId => {
			const dataSource = DataSources.get(dataSourceId as string) as VectorTargetDataSource;
			
			if (!dataSource) throw new CustomError(`Data source ${dataSourceId} not found`);
			
			return dataSource;
		});
	}
	
	private get tools(): Record<string, DataSource> {
		const tools = {};
		for (const dataSource of this.dataSources) {
			const toolName = `query_datasource_${dataSource.id.replace(/[^a-zA-Z0-9_]/g, '_')}`;
			tools[toolName] = dataSource;
		}
		return tools;
	}
	
	public async prepare(catalog: Catalog): Promise<void> {
		if (this._catalog === catalog) return;
		
		Debug.log(`Preparing agent "${this.id}"`, 'Agent');
		
		this._invocation = undefined;
		
		this._catalog = catalog;
		
		return this._ready = Promise.all([
			this._loaded,
			this.prepareContext(catalog),
			this.determineTemperature(catalog),
		]).then(() => {
			this.isReady = true;
			Debug.log(`Completed preparation of agent "${this.id}"`, 'Agent');
		});
	}
	
	public async invoke(): Promise<JsonObject> {
		return this._invocation ??= this._invoke();
	}
	
	private mapFiles(value: any, files: DataSourceItem<string>[] = []): any {
		if (value instanceof DataSourceItem) {
			files.push(value);
			return value.fileName;
		}
		
		if (Array.isArray(value)) {
			return value.map(item => this.mapFiles(item, files));
		}
		
		if (value !== null && typeof value === 'object') {
			const result: Record<string, any> = {};
			for (const [key, val] of Object.entries(value)) {
				result[key] = this.mapFiles(val, files);
			}
			return result;
		}
		
		return value;
	}
	
	private async prepareContext(catalog: Catalog): Promise<void> {
		const { context } = this;
		
		await Promise.all(context.map(async contextField => {
			const field = catalog.get(contextField);
			this._context[field.inputField] = await field.getValue();
			Debug.log(`Prepared context field "${contextField}" for agent "${this._id}"`, 'Agent');
		}));
	}
	
	private async determineTemperature(catalog: Catalog): Promise<void> {
		const { temperature } = this.configuration;
		
		this._temperature = typeof temperature === 'string'
				? await catalog.get(temperature).getValue() as number
				: temperature
		;
	}
	
	private async loadBaseInstructions(): Promise<void> {
		await Profiler.run(async () => {
			try {
				await this.baseInstructions.load();
			} catch (error) {
				throw new CustomError(`Missing instructions for agent "${this._id}"`);
			}
		}, `load base instructions for agent "${this.id}"`);
	}
	
	private async loadToolCallSchemas(): Promise<void> {
		await Profiler.run(async () => {
			await Promise.all(Object.keys(this.tools).map(async toolName => {
				const dataSource = this.tools[toolName];
				const schema = await dataSource.getToolCallSchema();
				
				if (!schema) throw new UnsupportedError('data source target for tool call', dataSource.configuration.target);
				
				this._toolCallSchemas[toolName] = schema;
			}));
		}, `load tool call schemas for agent "${this.id}"`);
	}
	
	private async _invoke(): Promise<JsonObject> {
		const { required } = this.configuration;
		
		await this._ready;
		
		Debug.log(`Invoking agent "${this.id}"`, 'Agent');
		
		if (required) for (const requiredField of required)	if (this._context[requiredField] === undefined) return {};
		
		const activity = Console.start(`Running agent "${this.id}"`);
		const result: JsonObject = await Profiler.run(() => this.query(this._context as Record<string, JsonField>), `${this.id} Agent.invoke`);
		activity.done();
		
		// TODO Implement or remove pagination
		
		Debug.log(`Completed invocation of agent "${this.id}"`, 'Agent');
		
		return result;
	}
	
	private async query(context: Record<string, JsonField>): Promise<JsonObject> {
		const { useHistory, outputTokens } = this.configuration;
		const instructions = this.instructions;
		const traceId = uuid();
		let files: DataSourceItem<string>[] = [];
		
		const mappedContext = this.mapFiles(context, files);
		
		debounce(() => Debug.dump(`agent ${this.id} instructions`, instructions), 1000)();
		Debug.dump(`agent ${this.id} ${traceId} context`, mappedContext);
		Debug.dump(`agent ${this.id} ${traceId} files`, files);
		
		let response: string, hasToolCalls: boolean, toolCallResults: ToolCallResult[] = [], output: JsonObject;
		let history = useHistory ? History.instance : new History(); // TODO use a local copy of history, we should not modify the global history
		let prompt = escapeUnicodeQuotes(JSON.stringify(mappedContext, undefined, 2));
		do {
			Debug.log(`Querying model for agent "${this.id} (trace ID: ${traceId})"`, 'Agent');
			try {
				response = await Profiler.run(() => LLM.query(prompt, {
						instructions,
						temperature: this._temperature,
						outputTokens,
						history,
						schema: this.outputSchema,
						files,
				}), `${this.id} Agent.query`);
			} catch (error) {
				error.message = `Agent "${this.id}" (trace ID: ${traceId}) - ${error.message}`;
				throw error;
			}
			
			Debug.dump(`agent ${this.id} ${traceId} response`, response);
			
			try {
				output = JSON.parse(escapeUnicodeQuotes(response).replaceAll("\\'", "'"));
			} catch (error) {
				throw new CustomError(`Agent "${this.id}" returned invalid JSON (trace ID: ${traceId})`);
			}
			
			const toolCalls = output._tool_calls as ToolCall[];
			hasToolCalls = Boolean(Array.isArray(toolCalls) && toolCalls.length);
			
			if (hasToolCalls) {
				Debug.dump(`agent ${this.id} tool calls`, toolCalls);
				if (output._status) Status.send(output._status as string);
				
				toolCallResults = await Promise.all(toolCalls.map(async toolCall => {
					Debug.log(`Calling tool "${toolCall.toolName}" for agent "${this.id}"`, 'Agent');
					try {
						const result = await this.tools[toolCall.toolName].toolCall(toolCall.arguments);
						Debug.dump(`agent ${this.id} tool call result`, result);
						return result;
					} catch (error) {
						Debug.log(`Tool call "${toolCall.toolName}" failed: ${error.message}`, 'Agent');
						return { error: error.message };
					}
				}));
				
				history.add('user', prompt);
				history.add('model', response);
				const mappedToolCallResults = this.mapFiles(toolCallResults, files = []);
				
				prompt = JSON.stringify({ _tool_call_results: mappedToolCallResults }, undefined, 2);
				
				Debug.dump(`agent ${this.id} history`, history);
			}
			
		} while (hasToolCalls);
		
		return output;
	}
}
