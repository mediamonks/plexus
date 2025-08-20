const DataSourceBehavior = require('../DataSourceBehavior');

class FilesDataSourceTarget extends DataSourceBehavior {
	async read() {
		const items = await this.getItems();
		
		// TODO if vertexai and gs:// => return as is.
	
		return await Promise.all(items.map(item => item.getLocalFile()));
	}
	
	async ingest() {
	}
	
	async query() {
		return this.getData();
	}
}

module.exports = FilesDataSourceTarget;
