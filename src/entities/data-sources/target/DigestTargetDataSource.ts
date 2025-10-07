import DataSource from '../DataSource';
import LLM from '../../LLM';
import Storage from '../../storage/Storage';
import StorageFile from '../../storage/StorageFile';
import IEntity from '../../Entity';
import Instructions from '../../Instructions';

export default class DigestTargetDataSource extends DataSource implements IEntity {
	public static Configuration: typeof DataSource.Configuration & {
		instructions: string;
	}
	
	private _instructions: Instructions;
	
	protected get instructions() {
		return this._instructions ??= new Instructions(this);
	}
	
	get configuration(): typeof DigestTargetDataSource.Configuration {
		return {
			...super.configuration,
			instructions: this._configuration.instructions as string,
		};
	}
	
	public async ingest(): Promise<void> {
		const data = await this.read();
		
		await Storage.get(StorageFile.TYPE.UNSTRUCTURED_DATA, this.id).write(data);
	}
	
	public async query(): Promise<string> {
		try {
			return await Storage.get(StorageFile.TYPE.UNSTRUCTURED_DATA, this.id).read();
		} catch (error) {
			return await this.read();
		}
	}
	
	private async read(): Promise<string> {
		const input = await this.origin.getText();
		
		return await LLM.query(input, {
			instructions: await this.instructions.get(),
			temperature: 0,
		});
	}
}
