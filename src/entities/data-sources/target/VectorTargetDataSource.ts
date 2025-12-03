import DataSource from '../DataSource';
import { JsonObject } from '../../../types/common';
import VectorDB from '../../../services/vector-db/VectorDB';
import Firestore from '../../../services/google-cloud/Firestore';

export default abstract class VectorTargetDataSource extends DataSource {
	public static Configuration: typeof DataSource.Configuration & {
		incremental?: boolean;
		externalIngestionTracking?: boolean;
	}
	
	get configuration(): typeof VectorTargetDataSource.Configuration {
		return {
			...super.configuration,
			incremental: this._configuration.incremental,
		} as typeof VectorTargetDataSource.Configuration;
	}
	
	public async ingest(): Promise<void> {
		const exists = await VectorDB.tableExists(this.id);
		
		if (this.configuration.incremental && exists) {
			return VectorDB.append(this.id, this.filteredGenerator());
		}
		
		if (exists) await VectorDB.drop(this.id);
		await VectorDB.create(this.id, this.generator());
	}
	
	protected abstract generator(): AsyncGenerator<JsonObject & { _vector: number[], _id: string }>;
	
	private async *filteredGenerator(): AsyncGenerator<JsonObject & { _vector: number[], _id: string }> {
		let ingestedIds: Set<string>;
		if (this.configuration.externalIngestionTracking) {
			const doc = await Firestore.getDocument('vectordb', this.id);
			ingestedIds = new Set((doc?.ingested as string[]) ?? []);
		} else {
			ingestedIds = await VectorDB.getIds(this.id);
		}
		
		for await (const item of this.generator()) {
			if (ingestedIds.has(item._id)) continue;
			yield item;
		}
	}
};
