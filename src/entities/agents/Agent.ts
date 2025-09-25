import fs from 'node:fs';
import Catalog from '../catalog/Catalog';
import DataSourceItem from '../data-sources/platform/DataSourceItem';
import CustomError from '../error-handling/CustomError';
import Storage from '../storage/Storage';
import StorageFile from '../storage/StorageFile';
import llm from '../../modules/llm';
import gcs from '../../services/gcs';
import config from '../../utils/config';
import Debug from '../../utils/Debug';
import History from '../../utils/History';
import Profiler from '../../utils/Profiler';
import status from '../../utils/status';
import { JsonField, JsonObject } from '../../types/common';

const INPUT_OUTPUT_TEMPLATE = fs
	.readFileSync('./data/input-output-template.txt', 'utf8')
	.toString();

export default class Agent {
	public isReady: boolean = false;
	private _baseInstructions: string;
	private _catalog: Catalog;
	private readonly _configuration: typeof Agent.Configuration;
	private readonly _context: Record<string, Promise<void> | JsonField> = {};
	private _displayName: string;
	private readonly _files: string[] = [];
	private readonly _id: string;
	private _invocation: Promise<JsonObject>;
	private _ready: Promise<void>;
	private _temperature: number  = 0;

	static readonly Configuration: {
		readonly context?: readonly string[];
		readonly instructions?: string;
		readonly required?: readonly string[];
		readonly useHistory?: boolean;
		readonly temperature?: number | string;
		readonly paginationRule?: string;
	};
	
	public constructor(id: string, configuration: typeof Agent.Configuration) {
		this._id = id;
		this._configuration = configuration;
		
		this._ready = this._loadBaseInstructions();
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
			inputSchema[fieldId] = this.catalog.get(fieldId).example;
		}
		
		const outputSchema = this.catalog.getAgentOutputSchema(this.id);
		
		const inputOutput = INPUT_OUTPUT_TEMPLATE
				.replace(/\{input}/, JSON.stringify(inputSchema, undefined, 2))
				.replace(/\{output}/, JSON.stringify(outputSchema, undefined, 2));
	
		return [this._baseInstructions, this.configuration.paginationRule, inputOutput].join('\n\n');
	}
	
	public get catalog(): Catalog {
		return this._catalog;
	}
	
	private async _mapFiles(value: JsonField | DataSourceItem[]): Promise<JsonField> {
		if (!(value instanceof Array) || !(value[0] instanceof DataSourceItem)) return value as JsonField;
		
		const files = await Promise.all(value.map(item => item.getLocalFile()));
		
		this._files.push(...files);
		
		return value.map(item => item.fileName);
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
		if (this._baseInstructions) return;
		
		const { instructions } = this.configuration;
		const instructionsPath = config.get('instructionsPath');
		
		try {
			if (instructions) {
				if (instructions.startsWith('gs://')) {
					this._baseInstructions = await gcs.cache(this.configuration.instructions);
				} else {
					this._baseInstructions = instructions;
				}
			} else if (instructionsPath) {
				this._baseInstructions = await gcs.cache(`${instructionsPath}/${this.id}.txt`);
			} else {
				this._baseInstructions = await Storage.get(StorageFile.TYPE.AGENT_INSTRUCTIONS, this.id).read();
			}
		} catch (error) {
			throw new CustomError(`Missing instructions for agent "${this._id}"`);
		}
	}
	
	public prepare(catalog: Catalog): void {
		if (this._catalog === catalog) return;
		
		Debug.log(`Preparing ${this.id}`, 'Agent');
		
		this._invocation = undefined;
		
		this._catalog = catalog;
		
		this._ready = Promise.all([
			this._ready,
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
		
		Debug.dump(`agent ${this.id} instructions`, this.instructions);
		Debug.dump(`agent ${this.id} prompt`, this._context);
		Debug.dump(`agent ${this.id} files`, this._files);
		
		const response = await status.wrap(`Running ${this.id} agent`, () =>
			Profiler.run(() =>
				llm.query(JSON.stringify(this._context, undefined, 2), {
					systemInstructions: this.instructions,
					temperature: this._temperature,
					history: useHistory && History.instance,
					structuredResponse: true,
					files: this._files,
				}),
				`invoke agent "${this.id}"`
			)
		);
		
		Debug.dump(`agent ${this.id} response`, response);
		
		let output;
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
	
	public get files(): readonly string[] {
		return this._files;
	}
}
