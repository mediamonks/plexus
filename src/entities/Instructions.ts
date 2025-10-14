import IEntity from './Entity';
import Storage from './storage/Storage';
import StorageFile from './storage/StorageFile';
import GoogleCloudStorage from '../services/google-cloud/GoogleCloudStorage';
import Config from '../core/Config';

export default class Instructions {
	constructor(private readonly _parent: IEntity) {}
	
	private _instructions: string;
	
	public async get(): Promise<string> {
		if (!this._instructions) await this.load();
		
		return this._instructions;
	}
	
	public async load(): Promise<void> {
		const instructionsPath = Config.get('instructionsPath');
		const { instructions } = this._parent.configuration;
		
		if (instructions) {
			if (instructions.startsWith('gs://')) {
				this._instructions = await GoogleCloudStorage.read(instructions);
			} else {
				this._instructions = instructions;
			}
		} else if (instructionsPath) {
			this._instructions = await GoogleCloudStorage.read(`${instructionsPath}/${this._parent.id}.txt`);
		} else {
			this._instructions = await Storage.get(StorageFile.TYPE.AGENT_INSTRUCTIONS, this._parent.id).read();
		}
	}
	
	public toString(): string {
		return this._instructions;
	}
}
