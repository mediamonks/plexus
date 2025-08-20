const DataSourceBehavior = require('../DataSourceBehavior');
const vectordb = require('../../../modules/vectordb');

class VectorDataSourceTarget extends DataSourceBehavior {
	async read() {
		const contents = this.getContents();
		
		return async function* () {
			for await (const data of contents) {
				for await (const record of data) {
					yield { ...record, vector: await vectordb.generateDocumentEmbeddings(record) };
				}
			}
		};
	}
	
	async ingest() {
		// TODO support incremental ingesting
		await vectordb.drop(this.id);
		await vectordb.create(this.id, this.read());
	}
	
	async query({ input, limit, filter, fields }) {
		const embeddings = await vectordb.generateQueryEmbeddings(input);
		
		return {
			text: async () => {
				const result = await vectordb.search(this.id, embeddings, { limit, fields: ['text'] });
				
				return result.map(item => item['text']);
			},
			data: () => vectordb.search(this.id, embeddings, { limit, filter, fields }),
		}[this.dataType]();
	}
}

module.exports = VectorDataSourceTarget;
