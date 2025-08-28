import fs from 'node:fs';
import CatalogField from '../catalog/CatalogField';
import OutputCatalogField from '../catalog/OutputCatalogField';
import DataSourceItem from '../data-sources/platform/DataSourceItem';
import Storage from '../storage/Storage';
import StorageFile from '../storage/StorageFile';
import llm from '../../modules/llm';
import Debug from '../../utils/Debug';
import History from '../../utils/History';
import Profiler from '../../utils/Profiler';
import status from '../../utils/status';
import Catalog from '../catalog/Catalog';
import { JsonField, JsonObject } from '../../types/common';

const INPUT_OUTPUT_TEMPLATE = fs
	.readFileSync('./data/input-output-template.txt', 'utf8')
	.toString();

type AgentConfiguration = {
	context: string[];
	required?: string[];
	useHistory?: boolean;
	temperature?: number | string;
}

export default class Agent {
	isReady: boolean = false;
	_baseInstructions: string;
	_catalog: Catalog;
	_configuration: JsonObject;
	_context: Record<string, Promise<void> | JsonField> = {};
	_displayName: string;
	_files: string[] = [];
	_id: string;
	_invocation: Promise<JsonObject>;
	_ready: Promise<void>;
	_temperature: number  = 0;

	static Configuration: {
		context: string[];
		required?: string[];
		useHistory?: boolean;
		temperature?: number | string;
	};
	
	constructor(id: string, configuration: JsonObject) {
		this._id = id;
		this._configuration = configuration;
		
		this._ready = this._loadBaseInstructions();
	}
	
	get id(): string {
		return this._id;
	}
	
	get configuration(): AgentConfiguration {
		return this._configuration as AgentConfiguration;
	}
	
	get displayName(): string {
		return this._displayName ??= this.id
				.split(/[-_\s]+/)
				.map(word => word.charAt(0).toUpperCase() + word.slice(1))
				.join('');
	}
	
	get instructions(): string {
		const inputSchema = {};
		for (const fieldId of this.configuration.context) {
			inputSchema[fieldId] = this.catalog.get(fieldId).example;
		}
		
		const outputSchema = {};
		for (const field of this.catalog.fields) {
			if (field.type !== CatalogField.TYPE.OUTPUT) continue;

			if ((field as OutputCatalogField).agentId !== this.id) continue;
			
			outputSchema[(field as OutputCatalogField).outputField] = field.example;
		}
		
		const inputOutput = INPUT_OUTPUT_TEMPLATE
				.replace(/\{input}/, JSON.stringify(inputSchema, undefined, 2))
				.replace(/\{output}/, JSON.stringify(outputSchema, undefined, 2));
	
		return [this._baseInstructions, inputOutput].join('');
	}
	
	get catalog(): Catalog {
		return this._catalog;
	}
	
	async _mapFiles(value: JsonField | DataSourceItem[]): Promise<JsonField> {
		if (!(value instanceof Array) || !(value[0] instanceof DataSourceItem)) return value as JsonField;
		
		const files = await Promise.all(value.map(item => item.getLocalFile()));
		
		this._files.push(...files);
		
		return value.map(item => item.fileName);
	}
	
	async _prepareContext(catalog: Catalog): Promise<void> {
		const { context } = this.configuration;
		
		await Promise.all(context.map(async contextField =>
			this._context[contextField] = catalog.get(contextField).getValue()
				.then(async value => {
					this._context[contextField] = await this._mapFiles(value);
					Debug.log(`Prepared context field "${contextField}" for agent "${this._id}"`, 'Agent');
				})
		));
	}
	
	async _determineTemperature(catalog: Catalog): Promise<void> {
		const { temperature } = this.configuration;
		
		this._temperature = typeof temperature === 'string'
				? await catalog.get(temperature).getValue() as number
				: temperature
		;
	}
	
	async _loadBaseInstructions(): Promise<void> {
		if (this._baseInstructions) return;
		
		try {
			this._baseInstructions = await Storage.get(StorageFile.TYPE.AGENT_INSTRUCTIONS, this.id).read();
		} catch (error) {
			throw new Error(`Missing instructions for agent "${this._id}"`)
		}
	}
	
	prepare(catalog: Catalog): void {
		if (this._catalog === catalog) return;
		
		Debug.log(`Preparing ${this.id}`, 'Agent');
		
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
	
	async _invoke(): Promise<JsonObject> {
		const { required, useHistory } = this.configuration;
		
		await this._ready;
		
		Debug.log(`Invoking ${this.id}`, 'Agent');
		
		if (required) for (const requiredField of required)	if (this._context[requiredField] === undefined) return {};
		
		Debug.dump(`agent ${this.id} instructions`, this.instructions);
		Debug.dump(`agent ${this.id} prompt`, this._context);
		
		const response = await status.wrap(`Running ${this.id} agent`, () =>
			Profiler.run(() =>
				llm.query(JSON.stringify(this._context, undefined, 2), {
					systemInstructions: this.instructions,
					temperature: this._temperature,
					history: useHistory && History.instance,
					structuredResponse: true,
					files: this._files,
				}),
				`${this.id} Agent - query`
			)
		);
		
		Debug.dump(`agent ${this.id} response`, response);
		
		let output;
		try {
			output = JSON.parse(response);
		} catch (error) {
			throw new Error(`Error: ${this.displayName} agent returned invalid JSON`);
		}
		
		Debug.log(`Completed invocation of ${this.id}`, 'Agent');
		
		return output;
	}
	
	async invoke(): Promise<JsonObject> {
		return this._invocation ??= this._invoke();
	}
}
