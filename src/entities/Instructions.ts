import IHasInstructions from './IHasInstructions';
import Storage from './storage/Storage';
import StorageFile from './storage/StorageFile';
import CloudStorage from '../services/google-cloud/CloudStorage';
import Config from '../core/Config';

export default class Instructions {
	constructor(private readonly _parent: IHasInstructions) {}
	
	private _instructions: string;
	
	public async get(): Promise<string> {
		if (!this._instructions) await this.load();
		
		return this._instructions;
	}
	
	public async load(): Promise<void> {
		this._instructions = await this.read();
	}
	
	public toString(): string {
		return this._instructions;
	}
	
	private async read(): Promise<string> {
		const { instructions } = this._parent.configuration;
		
		if (instructions) {
			if (instructions.startsWith('gs://')) return await CloudStorage.read(instructions);
			
			return instructions;
		}
		
		const instructionsPath = Config.get('instructionsPath');
		if (instructionsPath) return await CloudStorage.read(`${instructionsPath}/${this._parent.id}.txt`);
		
		return await Storage.get(StorageFile.TYPE.AGENT_INSTRUCTIONS, this._parent.id).read();
	}
};
