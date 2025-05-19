const fs = require('node:fs/promises');
const platforms = {
	azure: require('../../services/azure'),
	openai: require('../../services/openai'),
	google: require('../../services/vertexai'),
};
const config = require('../../utils/config');
const Debug = require('../../utils/Debug');
const Profiler = require('../../utils/Profiler');

module.exports = class Agent {
	static isRefinementAgent = false;
	static _name;
	static contextFields = [];
	isReady = false;
	_context;
	_inputData = {};
	_ready;

	constructor(context) {
		this._context = context;
		
		const contextFields = [
			...this.constructor.contextFields,
			'country',
			'language',
		];
		
		for (const contextField of contextFields)
			if (this._context[contextField])
				this._inputData[contextField] = this._context[contextField];
		
		this._ready = this.prepare().then(() => {
			this.isReady = true;
			Debug.log(`${this.name} - input: ${JSON.stringify(this._inputData)}`);
		});
	}
	
	static get contextFieldName() {
		if (!this.isRefinementAgent) return '';
		return this._name
				.toLowerCase()
				.replace(/^\w|[A-Z]|\b\w/g, (match, index) =>
					index ? match.toUpperCase() : match.toLowerCase()
				)
				.replace(/\s+/g, '')
		;
	}
	
	get name() {
		return this.constructor._name;
	}
	
	get systemInstructionsName() {
		return this.name.toLowerCase().replace(/\s+/g, '-');
	}
	
	get dataFieldName() {
		return this.name.toLowerCase().replace(/\s+/g, '_');
	}
	
	async prepare() { }
	
	async invoke({ input = {}, temperature = 0, history, revisionRecord = [] } = {}) {
		const { platform, model } = config.get();
		if (!platforms[platform]) throw new Error(`Invalid platform selection: "${platform}". Must be either "google", "openai" or "azure".`);
		
		const systemInstructions = (await fs.readFile(`./data/system-instructions/${this.systemInstructionsName}-agent.txt`)).toString();
		
		await this._ready;
		
		const response = await Profiler.run(async () =>
				platforms[platform].query(JSON.stringify({ ...this._inputData, ...input }), {
					systemInstructions,
					temperature,
					history,
					structuredResponse: true,
					model,
				}),
		`${this.name} Agent`);
		
		let output;
		try {
			output = JSON.parse(response);
		} catch (error) {
			throw new Error(`Error: ${this.name} agent returned invalid JSON`);
		}
		
		for (const key in output) {
			Debug.log(`${this.name} - ${key}: ${JSON.stringify(output[key])}`);
		}
		
		if (output['copy']) revisionRecord.push({ [this.name]: output['revisionNotes'] });
		
		return { copy: output['copy'], textResponse: output['textResponse'] };
	}
};
