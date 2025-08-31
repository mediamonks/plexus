import IDataTypeDataSourceBehavior from './data-type/IDataTypeDataSourceBehavior';
import StructuredDataSourceBehavior from './data-type/StructuredDataSourceBehavior';
import UnstructuredDataSourceBehavior from './data-type/UnstructuredDataSourceBehavior';
import IDataSourcePlatformBehavior from './platform/IPlatformDataSourceBehavior';
import DataSourceItem from './platform/DataSourceItem';
import DriveDataSourceBehavior from './platform/DriveDataSourceBehavior';
import GcsDataSourceBehavior from './platform/GcsDataSourceBehavior';
import DigestTargetDataSourceBehavior from './target/DigestTargetDataSourceBehavior';
import FilesTargetDataSourceBehavior from './target/FilesTargetDataSourceBehavior';
import ProfileTargetDataSourceBehavior from './target/ProfileTargetDataSourceBehavior';
import RawDataDataSourceTarget from './target/RawDataTargetDataSourceBehavior';
import RawTextTargetDataSourceBehavior from './target/RawTextTargetDataSourceBehavior';
import VectorTargetDataSourceBehavior from './target/VectorTargetDataSourceBehavior';
import RequestContext from '../../utils/RequestContext';
import UnsupportedError from '../../utils/UnsupportedError';
import { ValueOf, JsonObject } from '../../types/common';
import Catalog from '../catalog/Catalog';

const GOOGLE_DRIVE_URI_PATTERN = /^https?:\/\/(?:drive|docs)\.google\.com\/(?:drive\/(folders)|(?:file|document|spreadsheets|presentation)\/d)\/([\w\-]+)/;

export default class DataSource {
	_id: string;
	_configuration: typeof DataSource.Configuration;
	_data;
	_dataType: ValueOf<typeof DataSourceItem.DATA_TYPE>;
	_dataTypeBehavior: IDataTypeDataSourceBehavior;
	_isDynamic: boolean;
	_items: DataSourceItem[];
	_platform: ValueOf<typeof DataSource.PLATFORM>;
	_platformBehavior: IDataSourcePlatformBehavior;
	_resolvedUri: string;
	_target: ValueOf<typeof DataSource.TARGET>;

	static Configuration: {
		type: string;
		source?: string;
		folder?: boolean;
		cache?: boolean;
		platform?: string;
		uri?: string;
		searchField?: string;
		namespace?: string;
	};

	static Contents: (typeof DataSourceItem.Content)[];

	static DataTypeBehavior: IDataTypeDataSourceBehavior;

	static PlatformBehavior: IDataSourcePlatformBehavior;

	static IngestedData: typeof DigestTargetDataSourceBehavior.OutputData;

	static OutputData: typeof DigestTargetDataSourceBehavior.OutputData
		| typeof FilesTargetDataSourceBehavior.OutputData
		| typeof ProfileTargetDataSourceBehavior.OutputData
		| typeof RawDataDataSourceTarget.OutputData
		| typeof RawTextTargetDataSourceBehavior.OutputData
		| typeof VectorTargetDataSourceBehavior.OutputData;
	
	constructor(id: string, configuration: typeof DataSource.Configuration) {
		this._id = id;
		this._configuration = configuration;
	}
	
	static PLATFORM = {
		DRIVE: 'drive',
		GCS: 'gcs',
	} as const;
	
	static get TARGET (): typeof StructuredDataSourceBehavior.TARGET & typeof UnstructuredDataSourceBehavior.TARGET {
		return { ...StructuredDataSourceBehavior.TARGET, ...UnstructuredDataSourceBehavior.TARGET };
	};
	
	get id(): string {
		return this._id;
	}
	
	get uri(): string {
		return this.configuration.uri;
	}
	
	get isDynamic(): boolean {
		return this._isDynamic ??= this.uri ? /\{\w+}/.test(this.uri) : this.source.startsWith(':'); // TODO for backwards compatibility
	}
	
	get configuration(): typeof DataSource.Configuration {
		return this._configuration;
	}
	
	get type(): string {
		return this.configuration.type;
	}
	
	get dataType(): ValueOf<typeof DataSourceItem.DATA_TYPE> {
		if (this._dataType) return this._dataType;

		const dataType = this.type.split(':')[0]; // TODO for backwards compatibility

		if (!Object.values(DataSourceItem.DATA_TYPE).includes(dataType as ValueOf<typeof DataSourceItem.DATA_TYPE>))
			 throw new UnsupportedError('data source data type', dataType, DataSourceItem.DATA_TYPE);

		return this._dataType = dataType as ValueOf<typeof DataSourceItem.DATA_TYPE>;
	}
	
	get dataTypeBehavior(): typeof DataSource.DataTypeBehavior {
		if (this._dataTypeBehavior) return this._dataTypeBehavior;

		// TODO support mixed/unknown
		const mapping = {
			[DataSourceItem.DATA_TYPE.UNSTRUCTURED]: UnstructuredDataSourceBehavior,
			[DataSourceItem.DATA_TYPE.STRUCTURED]: StructuredDataSourceBehavior,
		} as const;
		
		const dataTypeBehaviorClass = mapping[this.dataType];
	
		if (!dataTypeBehaviorClass) throw new UnsupportedError('data source data type', this.dataType, mapping);
		
		return this._dataTypeBehavior = new dataTypeBehaviorClass(this);
	}
	
	get platform(): ValueOf<typeof DataSource.PLATFORM> {
		if (this._platform) return this._platform;

		const mapping = {
			[DataSource.PLATFORM.DRIVE]: GOOGLE_DRIVE_URI_PATTERN,
			[DataSource.PLATFORM.GCS]: /^gs:\/\//
		};
		
		if (this.configuration.platform) {
			if (!mapping[this.configuration.platform])
				throw new UnsupportedError('data source platform', this.configuration.platform, DataSource.PLATFORM);
			
			return this._platform = this.configuration.platform as ValueOf<typeof DataSource.PLATFORM>;
		}
		
		if (this.isDynamic) throw new Error('Property `platform` must be explicitly set for dynamic data sources');
		
		this._platform = Object.keys(mapping)
			.find(platform => mapping[platform].test(this.uri)) as ValueOf<typeof DataSource.PLATFORM>;
		
		if (!this._platform) throw new UnsupportedError('data source URI', this.uri, mapping);
		
		return this._platform;
	}
	
	get platformBehavior(): typeof DataSource.PlatformBehavior {
		if (this._platformBehavior) return this._platformBehavior;

		const mapping = {
			[DataSource.PLATFORM.DRIVE]: DriveDataSourceBehavior,
			[DataSource.PLATFORM.GCS]: GcsDataSourceBehavior,
		};
		
		const platformBehaviorClass = mapping[this.platform];

		if (!platformBehaviorClass) throw new UnsupportedError('data source platform', this.platform, mapping);
		
		this._platformBehavior = new platformBehaviorClass(this);
		
		return this._platformBehavior;
	}
	
	get target(): ValueOf<typeof DataSource.TARGET> {
		if (this._target) return this._target;

		const target = this.type.split(':')[1]; // TODO for backwards compatibility

		if (!Object.values(DataSource.TARGET).includes(target as ValueOf<typeof DataSource.TARGET>))
			 throw new UnsupportedError('data source target', target, DataSource.TARGET);

		return this._target = target as ValueOf<typeof DataSource.TARGET>;
	}
	
	get source(): string {
		return this.configuration.source;
	}
	
	get isFolder(): boolean {
		return this.configuration.folder;
	}
	
	get allowCache(): boolean {
		return this.configuration.cache ?? true;
	}

	get searchField(): string {
		return this.configuration.searchField;
	}
	
	async getResolvedUri(): Promise<string> {
		if (!this.isDynamic) return this.uri;
		
		if (!this._resolvedUri) {
			this._resolvedUri = this.uri;
			const matches = this.uri.match(/\{\w+}/g);
			await Promise.all(matches.map(async match => {
				const field = match.substring(1, match.length - 1);
				const value = (await RequestContext.get('catalog') as Catalog).get(field).getValue();

				if (typeof value !== 'string') throw new Error(`Unable to use non-string value "${value}" of catalog field "${field}" in dynamic uri of data source "${this.id}"`);

				this._resolvedUri = this._resolvedUri.replaceAll(match, value);
			}));
		}
		
		return this._resolvedUri;
	}
	
	async getIngestedData(): Promise<typeof DataSource.OutputData> {
		try {
			return await this.dataTypeBehavior.getIngestedData();
		} catch (error) {
			// TODO this could technically be just a warning, because getData() can handle it
			throw new Error(`Data source "${this.id}" is not yet ingested`);
		}
	}
	
	async getItems(): Promise<DataSourceItem[]> {
		this._items ??= await this.platformBehavior.getItems();
		
		if (!this._items.length) throw new Error(`Data source "${this.id}" contains no items`);
		
		return this._items;
	}
	
	async getData(): Promise<typeof DataSource.OutputData> {
		if (this._data) return this._data;

		if (!this.isDynamic) this._data = await this.getIngestedData();

		if (!this._data) this._data = await this.read();

		return this._data;
	}
	
	async getContents(): Promise<typeof DataSource.Contents> {
		const items = await this.getItems();
		
		return await Promise.all(items.map(item => item.getContent()));
	}
	
	async read(): Promise<typeof DataSource.OutputData> {
		return this.dataTypeBehavior.read();
	}
	
	async ingest(): Promise<void> {
		if (this.isDynamic) return console.warn(`Not ingesting dynamic data source "${this.id}"`);
		
		return this.dataTypeBehavior.ingest();
	}
	
	async query(parameters: typeof StructuredDataSourceBehavior.QueryParameters): Promise<typeof DataSource.OutputData> {
		return this.dataTypeBehavior.query(parameters);
	}
}
