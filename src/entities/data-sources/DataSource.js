const StructuredDataSourceBehavior = require('./data-type/StructuredDataSourceBehavior');
const UnstructuredDataSourceBehavior = require('./data-type/UnstructuredDataSourceBehavior');
const DriveDataSourceBehavior = require('./platform/DriveDataSourceBehavior');
const GcsDataSourceBehavior = require('./platform/GcsDataSourceBehavior');
const config = require('../../utils/config');
const requestContext = require('../../utils/request-context');
const UnknownError = require('../../utils/UnknownError');
const UnsupportedError = require('../../utils/UnsupportedError');

const GOOGLE_DRIVE_URI_PATTERN = /^https?:\/\/(?:drive|docs)\.google\.com\/(?:drive\/(folders)|(?:file|document|spreadsheets|presentation)\/d)\/([\w\-]+)/;

class DataSource {
	_id;
	_configuration;
	_data;
	_dataType;
	_dataTypeBehavior;
	_isDynamic;
	_platformBehavior;
	_resolvedUri;
	_target;
	
	constructor(id) {
		this._id = id;
	}
	get id() {
		return this._id;
	}
	
	get uri() {
		return this.configuration.uri;
	}
	
	get isDynamic() {
		return this._isDynamic ??= this.uri ? /\{\w+}/.test(this.uri) : this.source.startsWith(':'); // TODO for backwards compatibility
	}
	
	get configuration() {
		if (!this._configuration) {
			const dataSources = config.get('data-sources');
			const configuration = dataSources[this.id];
			if (!configuration) throw new UnknownError('data source', this.id, dataSources);
			this._configuration = configuration;
		}
		
		return this._configuration;
	}
	
	get type() {
		return this.configuration.type;
	}
	
	get dataType() {
		return this._dataType ??= this.type.split(':')[0];
	}
	
	get dataTypeBehavior() {
		if (!this._dataTypeBehavior) {
			const mapping = {
				text: UnstructuredDataSourceBehavior,
				data: StructuredDataSourceBehavior,
			};
			
			const dataTypeBehaviorClass = mapping[this.dataType];
		
			if (!dataTypeBehaviorClass) throw new UnsupportedError('data source data type', this.dataType, mapping);
			
			this._dataTypeBehavior = new dataTypeBehaviorClass(this);
		}
		
		return this._dataTypeBehavior;
	}
	
	get platform() {
		if (!this._platform) this._platform = this.configuration.platform;
		
		if (!this._platform) {
			if (this.isDynamic) throw new Error('Property `platform` must be explicitly set for dynamic data sources');
			
			const mapping = {
				drive: GOOGLE_DRIVE_URI_PATTERN,
				gcs: /^gs:\/\//
			};
			
			this._platform = Object.keys(mapping).find(platform => mapping[platform].test(this.uri));
			
			if (!this._platform) throw new UnsupportedError('data source URI', this.uri, mapping);
		}
		
		return this._platform;
	}
	
	get platformBehavior() {
		if (!this._platformBehavior) {
			const mapping = {
				drive: DriveDataSourceBehavior,
				gcs: GcsDataSourceBehavior,
			};
			
			const platformBehaviorClass = mapping[this.platform];
		
			if (!platformBehaviorClass) throw new UnsupportedError('data source platform', this.platform, mapping);
			
			this._platformBehavior = new platformBehaviorClass(this);
		}
		
		return this._platformBehavior;
	}
	
	get target() {
		return this._target ??= this.type.split(':')[1];
	}
	
	get source() {
		return this.configuration.source;
	}
	
	get catalog() {
		return requestContext.get().catalog;
	}
	
	get isFolder() {
		return this.configuration.folder;
	}
	
	async getResolvedUri() {
		if (!this.isDynamic) return this.uri;
		
		if (!this._resolvedUri) {
			this._resolvedUri = this.uri;
			const matches = this.uri.match(/\{\w+}/g);
			await Promise.all(matches.map(async match => {
				const field = match.substring(1, match.length - 1);
				const value = await this.catalog.get(field).getValue();
				this._resolvedUri = this._resolvedUri.replaceAll(match, value);
			}));
		}
		
		return this._resolvedUri;
	}
	
	async getCachedData() {
		return this._data ??= await this.dataTypeBehavior.getCachedData();
	}
	
	async getItems() {
		this._items ??= await this.platformBehavior.getItems();
		
		if (!this._items.length) throw new Error(`Datasource "${this.id}" contains no items`);
		
		return this._items;
	}
	
	async getData() {
		if (this.isDynamic) return this._data ??= await this.read();
		
		return this.getCachedData();
	}
	
	async getContents() {
		const items = await this.getItems();
		
		return await Promise.all(items.map(item => item.getContent()));
	}
	
	async read() {
		return this.dataTypeBehavior.read();
	}
	
	async ingest() {
		if (this.isDynamic) return console.warn(`Not ingesting dynamic data source "${this.id}"`);
		
		return this.dataTypeBehavior.ingest();
	}
	
	async query(parameters) {
		return this.dataTypeBehavior.query(parameters);
	}
}

module.exports = DataSource;
