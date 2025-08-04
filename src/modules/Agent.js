const fs = require('node:fs/promises');
const llm = require('./llm');
const storage = require('../services/storage');
const Debug = require('../utils/Debug');
const Profiler = require('../utils/Profiler');
const requestContext = require('../utils/request-context');
const agentDefinitions = require('../../config/agents.json');
const catalogDefinition = require('../../config/catalog.json');
const dataSources = require('../../config/data-sources.json');
const inputOutputTemplate = require('node:fs')
		.readFileSync('./data/input-output-template.txt', 'utf8')
		.toString();

module.exports = class Agent {
	isReady = false;
	_displayName;
	_context = {};
	_ready;
	_invocation;
	_systemInstructions;
	_temperature = 0;

	constructor(id) {
		this._id = id;

		console.debug('[Agent] Creating', this.displayName);
		
		this._ready = this.prepare();
	}
	
	get displayName() {
		this._displayName ??= this._id
				.split(/[-_\s]+/)
				.map(word => word.charAt(0).toUpperCase() + word.slice(1))
				.join('');
		
		return this._displayName;
	}
	
	get systemInstructionsName() {
		return this._id;
	}
	
	get systemInstructions() {
		const inputDescription = agentDefinitions[this._id].context
				.reduce((result, key) => ({ ...result, [key]: catalogDefinition[key].example }), {});
		const outputDescription = Object.keys(catalogDefinition)
				.filter(key => catalogDefinition[key].type === 'output' && catalogDefinition[key].agent === this._id)
				.reduce((result, key) => ({ ...result, [catalogDefinition[key].field]: catalogDefinition[key].example }), {});
		const inputOutput = inputOutputTemplate
				.replace(/\{input}/, JSON.stringify(inputDescription, undefined, 2))
				.replace(/\{output}/, JSON.stringify(outputDescription, undefined, 2));
		
		return [this._systemInstructions, inputOutput].join('');
	}
	
	async prepare() {
		if (!agentDefinitions[this._id]) throw new Error(`Unknown agent "${this._id}". Must be one of: ${Object.keys(agentDefinitions).join(', ')}`);
		
		console.debug('[Agent] Preparing', this.displayName);
		
		const { context, temperature } = agentDefinitions[this._id];
		const catalog = requestContext.get().catalog;
		const promises = [];
		
		for (const contextField of context) {
			this._context[contextField] = undefined;
			promises.push(catalog.get(contextField).then(value => this._context[contextField] = value));
		}
		
		if (typeof temperature === 'string')
			promises.push(catalog.get(temperature).then(value => this._temperature = value));
		else
			this._temperature = temperature;
		
		if (!this._systemInstructions) {
			promises.push(
				storage.cache(`system-instructions/${this.systemInstructionsName}-agent.txt`)
					.then(path => fs.readFile(path))
					.then(buffer => this._systemInstructions = buffer.toString())
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
		let { required, useHistory } = agentDefinitions[this._id];
		
		await this._ready;
		
		if (required) for (const requiredField of required)
			if (this._context[requiredField] === undefined) return {};
		
		//TODO this is ugly
		const files = [];
		for (const contextField of agentDefinitions[this._id].context) {
			if (!catalogDefinition[contextField].dataSource) continue;
			if (dataSources[catalogDefinition[contextField].dataSource].type.split(':')[1] !== 'files') continue;
			files.push(...this._context[contextField].map(file => file.source));
			this._context[contextField] = this._context[contextField].map(file => file.name);
		}
		
		console.debug(`[${this._displayName}]\n\n${this.systemInstructions}\n\n${JSON.stringify(this._context, undefined, 2)}`);
		
		const response = await Profiler.run(async () =>
				llm.query(JSON.stringify(this._context, undefined, 2), {
					systemInstructions: this.systemInstructions,
					temperature: this._temperature,
					history: useHistory && requestContext.get().history,
					structuredResponse: true,
					files,
				}),
			`${this.displayName} Agent - query`);
		
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
