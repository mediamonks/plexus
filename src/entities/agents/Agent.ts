import fs from 'node:fs';
import IHasInstructions from '../IHasInstructions';
import Instructions from '../Instructions';
import Catalog from '../catalog/Catalog';
import DataSourceItem from '../data-sources/origin/DataSourceItem';
import CustomError from '../error-handling/CustomError';
import Debug from '../../core/Debug';
import History from '../../core/History';
import Profiler from '../../core/Profiler';
import Status from '../../core/Status';
import LLM from '../../services/llm/LLM';
import { JsonField, JsonObject } from '../../types/common';

const INPUT_OUTPUT_TEMPLATE = fs
	.readFileSync('./data/input-output-template.txt', 'utf8')
	.toString();

export default class Agent implements IHasInstructions {
	public isReady: boolean = false;
	private _baseInstructions: Instructions;
	private _catalog: Catalog;
	private readonly _configuration: typeof Agent.Configuration;
	private readonly _context: Record<string, Promise<void> | JsonField> = {};
	private _displayName: string;
	private readonly _files: DataSourceItem<unknown, unknown>[] = [];
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
		readonly paginationRule?: string;
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
	
	public get displayName(): string {
		return this._displayName ??= this.id
				.split(/[-_\s]+/)
				.map(word => word.charAt(0).toUpperCase() + word.slice(1))
				.join('');
	}
	
	private get context(): readonly string[] {
		return this.configuration.context ?? [];
	}
	
	public get instructions(): string {
		const inputSchema = {};
		for (const fieldId of this.context) {
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
	
	private async _mapFiles(value: JsonField | DataSourceItem<unknown, unknown>[]): Promise<JsonField> {
		if (!(value instanceof Array) || !(value[0] instanceof DataSourceItem)) return value as JsonField;
		
		const items = value as DataSourceItem<unknown, unknown>[];
		
		this.files.push(...items);
		
		return items.map(item => item.fileName);
	}
	
	private async _prepareContext(catalog: Catalog): Promise<void> {
		const { context } = this;
		
		await Promise.all(context.map(async contextField =>
			this._context[contextField] = catalog.get(contextField).getValue()
				.then(async value => {
					this._context[contextField] = await this._mapFiles(value);
					Debug.log(`Prepared context field "${contextField}" for agent "${this._id}"`, 'Agent');
				})
		));
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
		}, `load base instructions for agent "${this.id}`);
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
			Debug.log(`Completed preparation of ${this.id}`, 'Agent');
		});
	}
	
	private async _invoke(): Promise<JsonObject> {
		const { required, useHistory } = this.configuration;
		
		await this._ready;
		
		Debug.log(`Invoking ${this.id}`, 'Agent');
		
		if (required) for (const requiredField of required)	if (this._context[requiredField] === undefined) return {};
		
		const instructions = this.instructions;
		
		Debug.dump(`agent ${this.id} instructions`, instructions);
		Debug.dump(`agent ${this.id} prompt`, this._context);
		Debug.dump(`agent ${this.id} files`, this.files);
		
		const response = await Status.wrap(`Running ${this.id} agent`, () =>
			Profiler.run(() =>
				LLM.query(JSON.stringify(this._context, undefined, 2), {
					instructions,
					temperature: this._temperature,
					history: useHistory && History.instance,
					structuredResponse: true,
					files: this.files,
				}),
				`invoke agent "${this.id}"`
			)
		);
		
		Debug.dump(`agent ${this.id} response`, response);
		
		let output: JsonObject;
		try {
			output = JSON.parse(response);
		} catch (error) {
			throw new CustomError(`Error: ${this.displayName} agent returned invalid JSON`);
		}
		
		Debug.log(`Completed invocation of ${this.id}`, 'Agent');
		
		return output;
	}
	
	public async invoke(): Promise<JsonObject> {
		return this._invocation ??= this._invoke();
	}
	
	public get files(): DataSourceItem<unknown, unknown>[] {
		return this._files;
	}
}
