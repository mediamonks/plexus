const DataSourceBehavior = require('../DataSourceBehavior');
const { STORAGE_FILE_DATA_TYPE, Storage } = require('../../storage/Storage');

class RawDataDataSourceTarget extends DataSourceBehavior {
	async read() {
		const contents = await this.getContents();
		return contents.flat();
	}
	
	async ingest() {
		const contents = await this.read();
		return Storage.get(STORAGE_FILE_DATA_TYPE.DATA, this.id).ingest(contents.join('\n'));
	}
	
	async query({ filter, limit, fields, sort } = {}) {
		const data = this.getData();
		
		if (!filter && !limit && !fields && !sort) return data;
		
		const result = [];
		for await (let item of data) {
			let include = true;
			
			if (filter) {
				for (const key in filter) {
					const value = await this.get(filter[key]);
					include = include && (item[key] === value);
					if (!include) break;
				}
			}
			
			if (!include) continue;
			
			if (fields) item = fields.reduce((resultItem, field) => ({ ...resultItem, [field]: item[field] }), {});
			
			result.push(item);
			
			// TODO perhaps select randomly if not sorting?
			if (!sort && result.length >= limit) break;
		}
		
		if (sort) {
			result.sort((a, b) => b[sort] - a[sort]);
			
			if (limit) return result.slice(0, limit);
		}
		
		return result;
	}
}

module.exports = RawDataDataSourceTarget;
