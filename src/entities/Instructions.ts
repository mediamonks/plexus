import IEntity from './Entity';
import gcs from '../services/gcs';
import Storage from './storage/Storage';
import StorageFile from './storage/StorageFile';
import config from '../utils/config';

export default class Instructions {
	constructor(private readonly _parent: IEntity) {}
	
	public async get(): Promise<string> {
		const instructionsPath = config.get('instructionsPath');
		const { instructions } = this._parent.configuration;
		
		if (instructions) {
			if (instructions.startsWith('gs://')) {
				return await gcs.cache(instructions);
			} else {
				return instructions;
			}
		} else if (instructionsPath) {
			return await gcs.cache(`${instructionsPath}/${this._parent.id}.txt`);
		} else {
			return await Storage.get(StorageFile.TYPE.AGENT_INSTRUCTIONS, this._parent.id).read();
		}
	}
}
