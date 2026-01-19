import DataSource from '../DataSource';
import LLM from '../../../services/llm/LLM';
import Storage from '../../storage/Storage';
import StorageFile from '../../storage/StorageFile';
import IHasInstructions from '../../IHasInstructions';
import Instructions from '../../Instructions';
import CustomError from '../../error-handling/CustomError';

export default class DigestTargetDataSource extends DataSource implements IHasInstructions {
	declare protected readonly _configuration: typeof DigestTargetDataSource.Configuration;

	public static readonly Configuration: typeof DataSource.Configuration & {
		instructions: string;
	}
	
	private _instructions: Instructions;
	
	protected get instructions(): Instructions {
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
	
	public async getToolCallSchema(): Promise<never> {
		throw new CustomError('Not implemented');
	}
	
	public async toolCall(): Promise<never> {
		throw new CustomError('Not implemented');
	}
	
	private async read(): Promise<string> {
		const input = await this.origin.getText();
		
		return await LLM.query(input, {
			instructions: await this.instructions.get(),
			temperature: 0,
		});
	}
};
