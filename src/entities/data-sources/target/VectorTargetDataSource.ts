import DataSource from '../DataSource';
import Console from '../../../core/Console';
import Debug from '../../../core/Debug';
import Firestore from '../../../services/google-cloud/Firestore';
import LanceDB from '../../../services/vector-db/LanceDB';
import VectorDB from '../../../services/vector-db/VectorDB';
import {
	JsonObject,
	ToolCallParameters, ToolCallResult,
	ToolCallSchema,
	VectorDBRecord
} from '../../../types/common';
import CustomError from '../../error-handling/CustomError';

export default abstract class VectorTargetDataSource extends DataSource {
	declare protected readonly _configuration: typeof VectorTargetDataSource.Configuration;
	
	public static readonly Configuration: typeof DataSource.Configuration & {
		incremental?: boolean;
		externalIngestionTracking?: boolean;
	}
	
	private get engine(): typeof VectorDB.engine {
		// TODO local engine config
		
		return VectorDB.engine;
	}
	
	public async getToolCallSchema(): Promise<ToolCallSchema> {
		const tableName = VectorDB.getInternalTableName(this.id);
		const schema = await this.engine.getSchema(tableName);
		const engineDescription = this.engine.description;
		const description = `Query ${engineDescription} database. It contains one table, called "${tableName}", with the following schema:\n${schema}`;
		
		return {
			description,
			parameters: {
				type: 'object',
				properties: {
					query: this.engine.toolCallQuerySchema,
				},
				required: ['query'],
			}
		};
	}
	
	public get configuration(): typeof VectorTargetDataSource.Configuration {
		return {
			...super.configuration,
			incremental: this._configuration.incremental,
		} as typeof VectorTargetDataSource.Configuration;
	}
	
	public async ingest(): Promise<void> {
		Debug.log(`Ingesting vector target data source "${this.id}"`, 'VectorTargetDataSource');
		
		const exists = await VectorDB.tableExists(this.id);
		
		if (this.configuration.incremental && exists) {
			return VectorDB.append(this.id, this.withActivity(this.filteredGenerator()));
		}
		
		if (exists) await VectorDB.drop(this.id);
		await VectorDB.create(this.id, this.withActivity(this.generator()));
	}
	
	public async toolCall({ query }: ToolCallParameters): Promise<ToolCallResult> {
		if (!query) throw new CustomError('Missing parameter "query" for vector target data source tool call');
		
		if (this.engine === LanceDB) {
			(query as typeof LanceDB.Query).tableName = this.id;
		}
		
		const data = await VectorDB.query(query as typeof VectorDB.Query);
		
		if (Array.isArray(data) && !data.length) {
			return { message: 'No records found matching this query.' };
		}
		
		return { data };
	}
	
	protected abstract vectorFields: string[];
	
	protected abstract generator(): AsyncGenerator<VectorDBRecord>;
	
	private async *withActivity(generator: AsyncGenerator<VectorDBRecord>): AsyncGenerator<VectorDBRecord> {
		let count = 0;
		Console.activity(`Ingesting vector target data source "${this.id}"`);
		for await (const item of generator) {
			Console.activity(`Ingesting vector target data source "${this.id}"`, count++);
			yield item;
		}
		Console.done();
	}
	
	// TODO this doesn't work, it should be _source for the source file (item.id) and a hash of record for the record _id
	private async *filteredGenerator(): AsyncGenerator<VectorDBRecord> {
		let ingestedIds: Set<string>;
		if (this.configuration.externalIngestionTracking) {
			const doc = await Firestore.getDocument('vectordb', this.id);
			ingestedIds = new Set((doc?.['ingested'] as string[]) ?? []);
		} else {
			ingestedIds = await VectorDB.getIds(this.id);
		}
		
		for await (const item of this.generator()) {
			if (ingestedIds.has(item._id)) continue;
			yield item;
		}
	}
};
