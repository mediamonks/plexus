const DataSourceItem = require('../data-sources/platform/DataSourceItem');
const Storage = require('../storage/Storage');
const StorageFile = require('../storage/StorageFile');
const llm = require('../../modules/llm');
const Debug = require('../../utils/Debug');
const History = require('../../utils/History');
const Profiler = require('../../utils/Profiler');
const status = require('../../utils/status');
const CatalogField = require('../catalog/CatalogField');
const INPUT_OUTPUT_TEMPLATE = require('node:fs')
	.readFileSync('./data/input-output-template.txt', 'utf8')
	.toString();

class Agent {
	isReady = false;
	_baseInstructions;
	_catalog;
	_configuration;
	_context = {};
	_displayName;
	_files = [];
	_invocation;
	_ready;
	_temperature = 0;
	
	constructor(id, configuration) {
		this._id = id;
		this._configuration = configuration;
		
		this._ready = this._loadBaseInstructions();
	}
	
	get id() {
		return this._id;
	}
	
	get configuration() {
		return this._configuration;
	}
	
	get displayName() {
		return this._displayName ??= this.id
				.split(/[-_\s]+/)
				.map(word => word.charAt(0).toUpperCase() + word.slice(1))
				.join('');
	}
	
	get instructions() {
		const inputSchema = {};
		for (const fieldId of this.configuration.context) {
			inputSchema[fieldId] = this.catalog.get(fieldId).example;
		}
		
		const outputSchema = {};
		for (const field of this.catalog.fields) {
			if (field.type !== CatalogField.TYPE.OUTPUT) continue;
			
			if (field.agentId !== this.id) continue;
			
			outputSchema[field.outputField] = field.example;
		}
		
		const inputOutput = INPUT_OUTPUT_TEMPLATE
				.replace(/\{input}/, JSON.stringify(inputSchema, undefined, 2))
				.replace(/\{output}/, JSON.stringify(outputSchema, undefined, 2));
	
		return [this._baseInstructions, inputOutput].join('');
	}
	
	get catalog() {
		return this._catalog;
	}
	
	async _mapFiles(value) {
		if (!(value instanceof Array) || !(value[0] instanceof DataSourceItem)) return value;
		
		const files = await Promise.all(value.map(item => item.getLocalFile()));
		
		this._files.push(...files);
		
		return value.map(item => item.fileName);
	}
	
	async _prepareContext(catalog) {
		const { context } = this.configuration;
		
		await Promise.all(context.map(async contextField =>
			this._context[contextField] = catalog.get(contextField).getValue()
				.then(async value => {
					this._context[contextField] = await this._mapFiles(value);
					Debug.log(`Prepared context field "${contextField}" for agent "${this._id}"`, 'Agent');
				})
		));
	}
	
	async _determineTemperature(catalog) {
		const { temperature } = this.configuration;
		
		this._temperature = typeof temperature === 'string'
				? await catalog.get(temperature).getValue()
				: temperature
		;
	}
	
	async _loadBaseInstructions() {
		if (this._baseInstructions) return;
		
		try {
			this._baseInstructions = await Storage.get(StorageFile.TYPE.AGENT_INSTRUCTIONS, this.id).read();
		} catch (error) {
			throw new Error(`Missing instructions for agent "${this._id}"`)
		}
	}
	
	prepare(catalog) {
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
	
	async _invoke() {
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
	
	async invoke() {
		return this._invocation ??= this._invoke();
	}
}

module.exports = Agent;
