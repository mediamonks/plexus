import DataSource from '../DataSource';
import DataSourceItem from '../origin/DataSourceItem';
import GoogleCloudStorageDataSourceItem from '../origin/GoogleCloudStorageDataSourceItem';
import Storage from '../../storage/Storage';
import LLM from '../../../services/llm/LLM';
import { ToolCallResult, ToolCallSchema } from '../../../types/common';
import Console from '../../../core/Console';
import CustomError from '../../error-handling/CustomError';
import path from 'node:path';

export default class FileTargetDataSource extends DataSource {
	declare protected readonly _configuration: typeof FileTargetDataSource.Configuration;
	
	public static readonly Configuration: typeof DataSource.Configuration & {
		incremental?: boolean;
		enableToolCalling?: boolean;
		summaryPrompt?: string;
	}
	
	public get configuration(): typeof FileTargetDataSource.Configuration {
		return {
			...super.configuration,
			incremental: this._configuration.incremental,
			enableToolCalling: this._configuration.enableToolCalling,
		} as typeof FileTargetDataSource.Configuration;
	}
	
	public async getToolCallSchema(): Promise<ToolCallSchema> {
		const fileIndex = await this.getFileIndex();
		
		return {
			description: `Retrieve the contents of one or more of the following files:\n${fileIndex}`,
			parameters: {
				type: 'object',
				properties: {
					files: {
						type: 'array',
						items: {
							type: 'string',
							description: 'The name of a file to retrieve'
						}
					},
				},
				required: ['files'],
			}
		};
	}
	
	public async ingest(): Promise<void> {
		const items = await this.origin.getItems();
		const prompt = this.configuration.summaryPrompt ?? 'Describe the contents of this file. Use no more than 100 words.';
		
		Console.activity(`Ingesting file target data source "${this.id}"`);
		await Promise.all(items.map(async (item, index) => {
			const localPath = await item.getLocalFile();
			const uri = Storage.getUri(this.id, path.basename(localPath));
			
			item = new GoogleCloudStorageDataSourceItem(this, uri, item.fileName);
			
			await LLM.upload(item);
			
			let description: string;
			if (this.configuration.enableToolCalling) {
				description = await LLM.query(prompt, { files: [item] });
			}
			
			await Storage.save(this.id, localPath, item.fileName, description);
			
			Console.activity(`Ingesting file target data source "${this.id}"`, index);
		}));
		Console.done();
		
		if (this.configuration.incremental) return;
		
		for (const file of await Storage.getFiles(this.id)) {
			if (items.find(item => item.fileName === file.name)) continue;
			
			await Storage.delete(this.id, file.internalName);
		}
	}
	
	public async query(): Promise<DataSourceItem[]> {
		const files = await Storage.getFiles(this.id);
		
		// TODO use IngestedDataSourceItem, or let DataSourceItem automatically return the ingested file if it exists.
		// So then DataSourceOrigin should return the ingested list of files when calling getItems.
		// Or maybe DataSource should have a getItems which checks for ingested items and returns those, otherwise returns origin.getItems()
		if (files.length) return files.map(file => new GoogleCloudStorageDataSourceItem(this, file.uri, file.name));
		
		return this.origin.getItems();
	}
	
	public async toolCall({ files }: { files: string[] }): Promise<ToolCallResult> {
		if (!this.configuration.enableToolCalling) throw new CustomError(`Tool calling is not enabled for data source "${this.id}"`);
		
		return {
			files: files.map(file => {
				const uri = Storage.getUri(this.id, file);
				return new GoogleCloudStorageDataSourceItem(this, uri, file);
			})
		};
	}
	
	private async getFileIndex(): Promise<string> {
		const files = await Storage.getFiles(this.id);
		return files.map(file => [file.name, file.description].join(': ')).join('\n');
	}
};
