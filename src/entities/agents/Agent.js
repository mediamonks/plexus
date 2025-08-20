const { default: Storage, STORAGE_FILE_DATA_TYPE } = require('../storage/Storage');
const llm = require('../../modules/llm');
const config = require('../../utils/config');
const Debug = require('../../utils/Debug');
const Profiler = require('../../utils/Profiler');
const requestContext = require('../../utils/request-context');
const status = require('../../utils/status');
const UnknownError = require('../../utils/UnknownError');

const inputOutputTemplate = require('node:fs')
		.readFileSync('./data/input-output-template.txt', 'utf8')
		.toString();

module.exports = class Agent {
	isReady = false;
	_configuration;
	_context = {};
	_displayName;
	_invocation;
	_ready;
	_systemInstructions;
	_temperature = 0;

	constructor(id) {
		this._id = id;
		
		this._ready = this.prepare();
	}
	
	get id() {
		return this._id;
	}
	
	get configuration() {
		if (!this._configuration) {
			const agentsConfig = config.get('agents');
			const configuration = agentsConfig[this.id];
			if (!configuration) throw new UnknownError('agent', this.id, agentsConfig);
			this._configuration = configuration;
		}
		
		return this._configuration;
	}
	
	get displayName() {
		this._displayName ??= this.id
				.split(/[-_\s]+/)
				.map(word => word.charAt(0).toUpperCase() + word.slice(1))
				.join('');
		
		return this._displayName;
	}
	
	get systemInstructionsName() {
		return this.id;
	}
	
	// TODO remove dependency on catalogDefinition
	get systemInstructions() {
		const catalogConfig = this.catalog.configuration;
		
		const inputDescription = this.configuration.context
				.reduce((result, key) => ({ ...result, [key]: catalogConfig[key].example }), {});
		const outputDescription = Object.keys(catalogConfig)
				.filter(key => catalogConfig[key].type === 'output' && catalogConfig[key].agent === this._id)
				.reduce((result, key) => ({ ...result, [catalogConfig[key].field]: catalogConfig[key].example }), {});
		const inputOutput = inputOutputTemplate
				.replace(/\{input}/, JSON.stringify(inputDescription, undefined, 2))
				.replace(/\{output}/, JSON.stringify(outputDescription, undefined, 2));
		
		return [this._systemInstructions, inputOutput].join('');
	}
	
	get catalog() {
		return requestContext.get().catalog;
	}
	
	async prepare() {
		console.debug('[Agent] Preparing', this.displayName);
		
		const { context, temperature } = this.configuration;
		const promises = [];
		
		for (const contextField of context) {
			this._context[contextField] = undefined;
			promises.push(this.catalog.get(contextField).getValue().then(value => this._context[contextField] = value));
		}
		
		if (typeof temperature === 'string')
			promises.push(this.catalog.get(temperature).getValue().then(value => this._temperature = value));
		else
			this._temperature = temperature;
		
		if (!this._systemInstructions) {
			promises.push(
				Storage.get(STORAGE_FILE_DATA_TYPE.TEXT, `system-instructions/${this.systemInstructionsName}-agent`).read()
					.then(text => this._systemInstructions = text)
					.catch(() => {
						throw new Error(`Missing system instructions for agent "${this._id}"`)
					}),
			);
		}
		
		await Promise.all(promises);
		
		this.isReady = true;
		
		// Debug.log(`${this.displayName} Agent - context: ${JSON.stringify(this._context)}`);
	}
	
	async _invoke() {
		const { required, useHistory, context } = this.configuration;
		
		await this._ready;
		
		if (required) for (const requiredField of required)
			if (this._context[requiredField] === undefined) return {};
		
		//TODO this is ugly
		const catalogConfig = this.catalog.configuration;
		const dataSources = config.get('data-sources');
		const files = [];
		for (const contextField of context) {
			if (!catalogConfig[contextField].dataSource) continue;
			if (dataSources[catalogConfig[contextField].dataSource].type.split(':')[1] !== 'files') continue;
			files.push(...this._context[contextField].map(file => file.source));
			this._context[contextField] = this._context[contextField].map(file => file.name);
		}
		
		// console.debug(`[${this._displayName}]\n\n${this.systemInstructions}\n\n${JSON.stringify(this._context, undefined, 2)}`);
		
		const response = await status.wrap(`Running ${this.displayName} agent`, () =>
			Profiler.run(() =>
				llm.query(JSON.stringify(this._context, undefined, 2), {
					systemInstructions: this.systemInstructions,
					temperature: this._temperature,
					history: useHistory && requestContext.get().history,
					structuredResponse: true,
					files,
				}),
				`${this.displayName} Agent - query`
			)
		);
		
		let output;
		try {
			output = JSON.parse(response);
		} catch (error) {
			throw new Error(`Error: ${this.displayName} agent returned invalid JSON`);
		}
		
		for (const key in output) {
			Debug.log(`${this.displayName} - output ${key}: ${JSON.stringify(output[key])}`);
		}
		
		return output;
	}
	
	async invoke() {
		return this._invocation ??= this._invoke();
	}
};
