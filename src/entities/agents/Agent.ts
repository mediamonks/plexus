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
	JsonField,
	JsonObject,
	ToolCallResult,
	ToolCallSchema
} from '../../types/common';

type ToolCall = {
	id: string;
	toolName: string;
	arguments: Record<string, unknown>;
};

const TOOLS_TEMPLATE = `### **Tools**
You have access to the following tools. To perform a tool call, use the \`_tool_calls\` field in your response. When performing one or more tool calls, use the \`_status\` field to provide a short description of what you are doing.`;
const INPUT_TEMPLATE = `### **Input Format (JSON)**`;
const OUTPUT_TEMPLATE = `### **Output Format (JSON)**
Output only JSON. Do **not** use markdown.`;

export default class Agent implements IHasInstructions {
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
		
		const inputSchema = {
			_tool_call_results: [],
		};
		for (let fieldId of this.context) {
			if (this.configuration.serialize && fieldId === this.configuration.serialize[0]) fieldId = this.configuration.serialize[1];
			
			const { example } = this.catalog.get(fieldId);
			if (!example) throw new CustomError(`Missing example for catalog field "${fieldId}"`);
			inputSchema[fieldId] = example;
		}
		if (Object.keys(inputSchema).length) {
			instructions.push(`${INPUT_TEMPLATE}\n${JSON.stringify(inputSchema, undefined, 2)}`);
		}
		
		const outputSchema = this.catalog.getAgentOutputSchema(this.id);
		if (tools.length) {
			outputSchema.properties._tool_calls = {
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
			outputSchema.properties._status = {
				type: 'string',
				description: 'short description of what the agent is doing',
				example: 'Looking up relevant documents'
			};
		}
		
		instructions.push(`${OUTPUT_TEMPLATE}\n${JSON.stringify(outputSchema, undefined, 2)}`);
		
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
			this._context[contextField] = await catalog.get(contextField).getValue();
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
		const { required, serialize } = this.configuration;
		
		await this._ready;
		
		Debug.log(`Invoking agent "${this.id}"`, 'Agent');
		
		if (required) for (const requiredField of required)	if (this._context[requiredField] === undefined) return {};
		
		let result: JsonObject = {};
		if (serialize) {
			const [collectionName, itemName] = serialize;
			const collection = this._context[collectionName];
			
			if (!(collection instanceof Array)) throw new CustomError(`Serialization context field "${this.configuration.serialize}" of agent "${this.id}" is not an array`);
			
			const activity = Console.start(`Serializing agent "${this.id}"`, collection.length);
			const results = await Promise.all(collection.map(async item => {
				const context = { ...this._context };
				delete context[collectionName];
				context[itemName] = item;
				const result = await this.query(context as Record<string, JsonField>);
				activity.progress();
				return result;
			}));
			activity.done();
			
			const keys = Object.keys(results[0]);
			for (const key of keys) {
				result[key] = results.map((item: JsonObject) => item[key]);
				if (result[key][0] instanceof Array) result[key] = result[key].flat();
			}
		} else {
			result = await this.query(this._context as Record<string, JsonField>);
		}
		
		// TODO Implement or remove pagination
		
		Debug.log(`Completed invocation of agent "${this.id}"`, 'Agent');
		
		return result;
	}
	
	private async query(context: Record<string, JsonField>): Promise<JsonObject> {
		const { useHistory, outputTokens } = this.configuration;
		const instructions = this.instructions;
		let files: DataSourceItem<string>[] = [];
		
		const mappedContext = this.mapFiles(context, files);
		
		Debug.dump(`agent ${this.id} instructions`, instructions);
		Debug.dump(`agent ${this.id} context`, mappedContext);
		Debug.dump(`agent ${this.id} files`, files);
		Debug.log(`Querying model for agent "${this.id}`, 'Agent');
		
		let response: string, hasToolCalls: boolean, toolCallResults: ToolCallResult[] = [], output: JsonObject;
		let history = useHistory ? History.instance : new History(); // TODO use a local copy of history, we should not modify the global history
		let prompt = JSON.stringify(mappedContext, undefined, 2);
		do {
			response = await Status.wrap(`Running agent "${this.id}"`, () =>
				LLM.query(prompt, {
					instructions,
					temperature: this._temperature,
					outputTokens,
					history,
					structuredResponse: true,
					files,
				})
			);
			
			Debug.dump(`agent ${this.id} response`, response);
			
			try {
				output = JSON.parse(response);
			} catch (error) {
				throw new CustomError(`Agent "${this.id}" returned invalid JSON`);
			}
			
			const toolCalls = output._tool_calls as ToolCall[];
			hasToolCalls = Boolean(Array.isArray(toolCalls) && toolCalls.length);
			
			if (hasToolCalls) {
				if (output._status) Status.send(output._status as string);
				
				toolCallResults = await Promise.all(toolCalls.map(async toolCall => {
					Debug.log(`Calling tool "${toolCall.toolName}" for agent "${this.id}"`, 'Agent');
					const result = await this.tools[toolCall.toolName].toolCall(toolCall.arguments);
					Debug.dump(`agent ${this.id} tool call result`, result);
					return result;
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
