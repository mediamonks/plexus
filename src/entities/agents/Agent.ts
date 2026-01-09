import fs from 'node:fs';
import { Type } from '@google/genai';
import IHasInstructions from '../IHasInstructions';
import Instructions from '../Instructions';
import Catalog from '../catalog/Catalog';
import DataSources from '../data-sources/DataSources';
import DataSourceItem from '../data-sources/origin/DataSourceItem';
import VectorTargetDataSource from '../data-sources/target/VectorTargetDataSource';
import CustomError from '../error-handling/CustomError';
import Console from '../../core/Console';
import Debug from '../../core/Debug';
import History from '../../core/History';
import Profiler from '../../core/Profiler';
import Status from '../../core/Status';
import LLM from '../../services/llm/LLM';
import { JsonField, JsonObject, LLMTool } from '../../types/common';

const INPUT_OUTPUT_TEMPLATE = fs
	.readFileSync('./data/input-output-template.txt', 'utf8')
	.toString();

export default class Agent implements IHasInstructions {
	public isReady: boolean = false;
	private _baseInstructions: Instructions;
	private _catalog: Catalog;
	private readonly _configuration: typeof Agent.Configuration;
	private readonly _context: Record<string, JsonField | DataSourceItem<unknown, unknown>[]> = {};
	private readonly _id: string;
	private _invocation: Promise<JsonObject>;
	private _loaded: Promise<void>;
	private _ready: Promise<void>;
	private _temperature: number  = 0;
	
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
		
		this._loaded = this._loadBaseInstructions();
	}
	
	public get id(): string {
		return this._id;
	}
	
	public get configuration(): typeof Agent.Configuration {
		return this._configuration as typeof Agent.Configuration;
	}
	
	private get context(): readonly string[] {
		return this.configuration.context ?? [];
	}
	
	public get instructions(): string {
		const inputSchema = {};
		for (let fieldId of this.context) {
			if (this.configuration.serialize && fieldId === this.configuration.serialize[0]) fieldId = this.configuration.serialize[1];
			
			const { example } = this.catalog.get(fieldId);
			if (!example) throw new CustomError(`Missing example for catalog field "${fieldId}"`);
			inputSchema[fieldId] = example;
		}
		
		const outputSchema = this.catalog.getAgentOutputSchema(this.id);
		
		const inputOutput = INPUT_OUTPUT_TEMPLATE
				.replace(/\{input}/, JSON.stringify(inputSchema, undefined, 2))
				.replace(/\{output}/, JSON.stringify(outputSchema, undefined, 2));
	
		return [this.baseInstructions, this.configuration.paginationRule, inputOutput].join('\n\n');
	}
	
	public get catalog(): Catalog {
		return this._catalog;
	}
	
	protected get baseInstructions(): Instructions {
		return this._baseInstructions ??= new Instructions(this);
	}
	
	private mapFiles(context: Record<string, JsonField | DataSourceItem<string, unknown>[] | DataSourceItem<string, unknown>>): { files: DataSourceItem<string, unknown>[], context: Record<string, JsonField> } {
		const files = [];
		context = { ...context };
		for (const [key, value] of Object.entries(context)) {
			if (!(value && ((value[0] ?? value) instanceof DataSourceItem))) continue;
			
			if (value instanceof Array) {
				const items = value as DataSourceItem<string, unknown>[];
				files.push(...items);
				context[key] = items.map(item => item.fileName);
				continue;
			}
			
			const item = value as DataSourceItem<string, unknown>;
			files.push(item);
			context[key] = item.fileName;
		}
		
		return { files, context: context as Record<string, JsonField> };
	}
	
	private async _prepareContext(catalog: Catalog): Promise<void> {
		const { context } = this;
		
		await Promise.all(context.map(async contextField => {
			this._context[contextField] = await catalog.get(contextField).getValue();
			Debug.log(`Prepared context field "${contextField}" for agent "${this._id}"`, 'Agent');
		}));
	}
	
	private async _determineTemperature(catalog: Catalog): Promise<void> {
		const { temperature } = this.configuration;
		
		this._temperature = typeof temperature === 'string'
				? await catalog.get(temperature).getValue() as number
				: temperature
		;
	}
	
	private async _loadBaseInstructions(): Promise<void> {
		await Profiler.run(async () => {
			try {
				await this.baseInstructions.load();
			} catch (error) {
				throw new CustomError(`Missing instructions for agent "${this._id}"`);
			}
		}, `load base instructions for agent "${this.id}"`);
	}
	
	public prepare(catalog: Catalog): void {
		if (this._catalog === catalog) return;
		
		Debug.log(`Preparing agent "${this.id}"`, 'Agent');
		
		this._invocation = undefined;
		
		this._catalog = catalog;
		
		this._ready = Promise.all([
			this._loaded,
			this._prepareContext(catalog),
			this._determineTemperature(catalog),
		]).then(() => {
			this.isReady = true;
			Debug.log(`Completed preparation of agent "${this.id}"`, 'Agent');
		});
	}
	
	private async _invoke(): Promise<JsonObject> {
		const { required, serialize } = this.configuration;
		
		await this._ready;
		
		Debug.log(`Invoking agent "${this.id}"`, 'Agent');
		
		if (required) for (const requiredField of required)	if (this._context[requiredField] === undefined) return {};
		
		Debug.dump(`agent ${this.id} instructions`, this.instructions);
		
		let result: JsonObject = {};
		if (serialize) {
			const [collectionName, itemName] = serialize;
			const collection = this._context[collectionName];
			
			if (!(collection instanceof Array)) throw new CustomError(`Serialization context field "${this.configuration.serialize}" of agent "${this.id}" is not an array`);
			
			let count = 0;
			Console.progress(count, collection.length, `Serializing agent "${this.id}"`);
			const results = await Promise.all(collection.map(async item => {
				const context = { ...this._context };
				delete context[collectionName];
				context[itemName] = item;
				const result = await this.query(context as Record<string, JsonField>);
				Console.progress(++count, collection.length, `Serializing agent "${this.id}"`);
				return result;
			}));
			Console.done();
			
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
	
	public async invoke(): Promise<JsonObject> {
		return this._invocation ??= this._invoke();
	}
	
	private get tools(): Record<string, LLMTool>{
		if (!this.configuration.dataSources) return {};
		
		const tools = {};
		for (const dataSourceId of this.configuration.dataSources) {
			const dataSource = DataSources.get(dataSourceId as string) as VectorTargetDataSource;
			if (!dataSource) throw new CustomError(`Data source ${dataSourceId} not found`);
			if (!(dataSource instanceof VectorTargetDataSource)) throw new CustomError(`Data source ${dataSourceId} is not a vector database`);
			
			const toolName = `query_datasource_${dataSourceId.replace(/[^a-zA-Z0-9_]/g, '_')}`;
			
			tools[toolName] = {
				description: `Query data source "${dataSourceId}"`,
				parameters: {
					type: Type.OBJECT,
					properties: {
						query: {
							type: Type.STRING,
							description: 'The query'
						}
					},
					required: ['query']
				},
				handler: async ({ query }) => {
					const result = await dataSource.customQuery(query);
					if (Array.isArray(result) && result.length === 0) {
						return [{ info: 'No records found matching this query.' }];
					}
					return result;
				}
			};
		}
		
		return tools;
	}
	
	private async query(context: Record<string, JsonField>): Promise<JsonObject> {
		const { useHistory, outputTokens } = this.configuration;
		const instructions = this.instructions;
		const tools = this.tools;
		let files: DataSourceItem<string, unknown>[];
		
		({ files, context } = this.mapFiles(context));
		
		Debug.dump(`agent ${this.id} prompt`, context);
		Debug.dump(`agent ${this.id} files`, files);
		
		const response = await Status.wrap(`Running agent "${this.id}"`, () =>
			LLM.query(JSON.stringify(context, undefined, 2), {
				instructions,
				temperature: this._temperature,
				outputTokens,
				history: useHistory && History.instance,
				structuredResponse: true,
				files,
				tools,
			})
		);
		
		Debug.dump(`agent ${this.id} response`, response);
		
		let output: JsonObject;
		try {
			output = JSON.parse(response);
		} catch (error) {
			throw new CustomError(`Agent "${this.id}" returned invalid JSON`);
		}
		
		return output;
	}
}
