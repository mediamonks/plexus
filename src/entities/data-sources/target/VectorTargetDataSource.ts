import DataSource from '../DataSource';
import Debug from '../../../core/Debug';
import Console from '../../../core/Console';
import VectorDB from '../../../services/vector-db/VectorDB';
import Firestore from '../../../services/google-cloud/Firestore';
import { JsonObject, VectorDBRecord } from '../../../types/common';

export default abstract class VectorTargetDataSource extends DataSource {
	declare protected readonly _configuration: typeof VectorTargetDataSource.Configuration;
	
	public static readonly Configuration: typeof DataSource.Configuration & {
		incremental?: boolean;
		externalIngestionTracking?: boolean;
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
	
	public async customQuery(query: string | JsonObject): Promise<JsonObject[]> {
		return await VectorDB.query(query);
	}
	
	protected abstract vectorFields: string[];
	
	protected abstract generator(): AsyncGenerator<VectorDBRecord>;
	
	private async *withActivity(generator: AsyncGenerator<VectorDBRecord>): AsyncGenerator<VectorDBRecord> {
		let count = 0;
		Console.activity(count, `Ingesting vector target data source "${this.id}"`);
		for await (const item of generator) {
			Console.activity(++count, `Ingesting vector target data source "${this.id}"`);
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
