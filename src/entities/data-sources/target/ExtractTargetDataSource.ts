import DataSource from '../DataSource';
import Instructions from '../../Instructions';
import Storage from '../../storage/Storage';
import StorageFile from '../../storage/StorageFile';
import CustomError from '../../error-handling/CustomError';
import LLM from '../../../services/llm/LLM';
import IHasInstructions from '../../IHasInstructions';
import UnsupportedError from '../../error-handling/UnsupportedError';
import { JsonObject } from '../../../types/common';

export default class ExtractTargetDataSource extends DataSource implements IHasInstructions {
	declare protected readonly _configuration: typeof ExtractTargetDataSource.Configuration;
	
	public static readonly Configuration: typeof DataSource.Configuration & {
		instructions: string;
		output: 'data' | 'text';
	}
	
	private _instructions: Instructions;
	
	protected get instructions(): Instructions {
		return this._instructions ??= new Instructions(this);
	}
	
	get configuration(): typeof ExtractTargetDataSource.Configuration {
		return {
			...super.configuration,
			instructions: this._configuration.instructions as string,
			output: this._configuration.output,
		};
	}
	
	public async ingest(): Promise<void> {
		const { output } = this.configuration;
		
		const data = await this.read();
		
		const outputMapping = {
			text: (data: string) => Storage.get(StorageFile.TYPE.UNSTRUCTURED_DATA, this.id).write(data),
			data: (data: JsonObject) => {
				const generator = async function*() { yield data; };
				Storage.get(StorageFile.TYPE.STRUCTURED_DATA, this.id).write(generator());
			},
		};
		
		if (!outputMapping[output]) throw new UnsupportedError('output type for data source target "extract"', output, Object.keys(outputMapping));
		
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
		const { dataType, output } = this.configuration;
		
		const dataTypeMapping = {
			[DataSource.DATA_TYPE.STRUCTURED]: () => this.origin.getData(),
			[DataSource.DATA_TYPE.UNSTRUCTURED]: () => this.origin.getText(),
		};
		
		if (!dataTypeMapping[dataType]) throw new UnsupportedError('data type for data source target "extract"', dataType, Object.keys(dataTypeMapping));

		const outputMapping = {
			text: (output: string) => output,
			data: (output: string) => JSON.parse(output),
		};
		
		if (!outputMapping[output]) throw new UnsupportedError('output type for data source target "extract"', output, Object.keys(outputMapping));
		
		const input = await dataTypeMapping[dataType]();
		
		const response = await LLM.query(input, {
			instructions: await this.instructions.get(),
			temperature: 0,
		});
		
		return outputMapping[output](response);
	}
}
