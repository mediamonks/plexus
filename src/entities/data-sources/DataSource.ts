import Catalog from '../catalog/Catalog';
import IDataTypeDataSourceBehavior from './data-type/IDataTypeDataSourceBehavior';
import StructuredDataSourceBehavior from './data-type/StructuredDataSourceBehavior';
import UnstructuredDataSourceBehavior from './data-type/UnstructuredDataSourceBehavior';
import IDataSourcePlatformBehavior from './platform/IPlatformDataSourceBehavior';
import ApiSourceDataSourceBehavior from './platform/ApiSourceDataSourceBehavior';
import DataSourceItem from './platform/DataSourceItem';
import DriveDataSourceBehavior from './platform/DriveDataSourceBehavior';
import GcsDataSourceBehavior from './platform/GcsDataSourceBehavior';
import ITargetDataSourceBehavior from './target/ITargetDataSourceBehavior';
import FileTargetDataSourceBehavior from './target/FileTargetDataSourceBehavior';
import CustomError from '../error-handling/CustomError';
import Profiler from '../../utils/Profiler';
import RequestContext from '../../utils/RequestContext';
import UnsupportedError from '../error-handling/UnsupportedError';
import { JsonArray, JsonObject, ValueOf } from '../../types/common';
import DigestTargetDataSourceBehavior from './target/DigestTargetDataSourceBehavior';

const GOOGLE_DRIVE_URI_PATTERN = /^https?:\/\/(?:drive|docs)\.google\.com\/(?:drive\/(folders)|(?:file|document|spreadsheets|presentation)\/d)\/([\w\-]+)/;

export default class DataSource {
	private readonly _id: string;
	private readonly _configuration: typeof DataSource.Configuration;
	private _data;
	private _dataType: ValueOf<typeof DataSourceItem.DATA_TYPE>;
	private _dataTypeBehavior: IDataTypeDataSourceBehavior;
	private _isDynamic: boolean;
	private _items: DataSourceItem[];
	private _platform: ValueOf<typeof DataSource.PLATFORM>;
	private _platformBehavior: IDataSourcePlatformBehavior;
	private _resolvedUri: string;
	private _target: ValueOf<typeof DataSource.TARGET>;
	private _targetBehavior: ITargetDataSourceBehavior;
	
	static readonly Configuration: {
		type?: string; // TODO for backwards compatibility
		dataType?: ValueOf<typeof DataSourceItem.DATA_TYPE>;
		target?: ValueOf<typeof DataSource.TARGET>;
		source?: string; // TODO for backwards compatibility
		folder?: boolean;
		cache?: boolean;
		platform?: ValueOf<typeof DataSource.PLATFORM>;
		uri?: string;
		searchField?: string;
		namespace?: string;
	} & ApiSourceDataSourceBehavior.Configuration;

	static readonly Contents: (typeof DataSourceItem.Content)[];

	static readonly DataTypeBehavior: IDataTypeDataSourceBehavior;

	static readonly PlatformBehavior: IDataSourcePlatformBehavior;
	
	public constructor(id: string, configuration: typeof DataSource.Configuration) {
		this._id = id;
		this._configuration = configuration;
	}
	
	static readonly PLATFORM = {
		DRIVE: 'drive',
		GCS: 'gcs',
	} as const;
	
	static get TARGET (): typeof StructuredDataSourceBehavior.TARGET & typeof UnstructuredDataSourceBehavior.TARGET & { FILE: 'file', FILES: 'files' } {
		return {
			...StructuredDataSourceBehavior.TARGET,
			...UnstructuredDataSourceBehavior.TARGET,
			FILE: 'file',
			FILES: 'files', // TODO for backwards compatibility
		};
	};
	
	public get id(): string {
		return this._id;
	}
	
	public get uri(): string {
		return this.configuration.uri;
	}
	
	public get isDynamic(): boolean {
		return this._isDynamic ??= this.uri ? /\{\w+}/.test(this.uri) : this.source.startsWith(':'); // TODO for backwards compatibility
	}
	
	public get configuration(): typeof DataSource.Configuration {
		return this._configuration;
	}
	
	public get type(): string {
		return this.configuration.type;
	}
	
	public get dataType(): ValueOf<typeof DataSourceItem.DATA_TYPE> {
		if (this._dataType) return this._dataType;
		
		const dataType = this.configuration.dataType ?? this.type?.split(':')?.[0]; // TODO for backwards compatibility

		if (!Object.values(DataSourceItem.DATA_TYPE).includes(dataType as ValueOf<typeof DataSourceItem.DATA_TYPE>)) {
			throw new UnsupportedError('data source data type', dataType, Object.values(DataSourceItem.DATA_TYPE));
		}

		return this._dataType = dataType as ValueOf<typeof DataSourceItem.DATA_TYPE>;
	}
	
	public get dataTypeBehavior(): typeof DataSource.DataTypeBehavior {
		if (this._dataTypeBehavior) return this._dataTypeBehavior;

		// TODO support mixed/unknown
		const mapping = {
			[DataSourceItem.DATA_TYPE.UNSTRUCTURED]: UnstructuredDataSourceBehavior,
			[DataSourceItem.DATA_TYPE.STRUCTURED]: StructuredDataSourceBehavior,
		} as const;
		
		const dataTypeBehaviorClass = mapping[this.dataType];
	
		if (!dataTypeBehaviorClass) throw new UnsupportedError('data source data type', this.dataType, Object.keys(mapping));
		
		return this._dataTypeBehavior = new dataTypeBehaviorClass(this);
	}
	
	public get platform(): ValueOf<typeof DataSource.PLATFORM> {
		if (this._platform) return this._platform;

		const mapping = {
			[DataSource.PLATFORM.DRIVE]: GOOGLE_DRIVE_URI_PATTERN,
			[DataSource.PLATFORM.GCS]: /^gs:\/\//
		};
		
		if (this.configuration.platform) {
			if (!mapping[this.configuration.platform])
				throw new UnsupportedError('data source platform', this.configuration.platform, Object.values(DataSource.PLATFORM));
			
			return this._platform = this.configuration.platform as ValueOf<typeof DataSource.PLATFORM>;
		}
		
		if (this.isDynamic) throw new CustomError('Property `platform` must be explicitly set for dynamic data sources');
		
		this._platform = Object.keys(mapping)
			.find(platform => mapping[platform].test(this.uri)) as ValueOf<typeof DataSource.PLATFORM>;
		
		if (!this._platform) throw new UnsupportedError('data source URI', this.uri, Object.keys(mapping));
		
		return this._platform;
	}
	
	public get platformBehavior(): typeof DataSource.PlatformBehavior {
		if (this._platformBehavior) return this._platformBehavior;

		const mapping = {
			[DataSource.PLATFORM.DRIVE]: DriveDataSourceBehavior,
			[DataSource.PLATFORM.GCS]: GcsDataSourceBehavior,
		};
		
		const platformBehaviorClass = mapping[this.platform];

		if (!platformBehaviorClass) throw new UnsupportedError('data source platform', this.platform, Object.keys(mapping));
		
		this._platformBehavior = new platformBehaviorClass(this);
		
		return this._platformBehavior;
	}
	
	public get target(): ValueOf<typeof DataSource.TARGET> {
		if (this._target) return this._target;

		const target = this.configuration.target ?? this.type.split(':')[1]; // TODO for backwards compatibility

		if (!Object.values(DataSource.TARGET).includes(target as ValueOf<typeof DataSource.TARGET>)) {
			throw new UnsupportedError('data source target', target, Object.values(DataSource.TARGET));
		}

		return this._target = target as ValueOf<typeof DataSource.TARGET>;
	}

	public get targetBehavior() {
		if (!this._targetBehavior) {
			const mapping = {
				digest: DigestTargetDataSourceBehavior,
				file: FileTargetDataSourceBehavior,
				files: FileTargetDataSourceBehavior, // TODO for backwards compatibility
			};
			
			const targetBehaviorClass = mapping[this.target] ?? this.dataTypeBehavior.targetBehaviorClass;
			
			if (!targetBehaviorClass) throw new UnsupportedError('data source target', this.target, Object.keys(mapping));
			
			this._targetBehavior = new targetBehaviorClass(this);
		}
		
		return this._targetBehavior;
	}
	
	public get source(): string {
		return this.configuration.source;
	}
	
	public get isFolder(): boolean {
		return this.configuration.folder;
	}
	
	public get allowCache(): boolean {
		return this.configuration.cache ?? true;
	}

	public get searchField(): string {
		return this.configuration.searchField;
	}
	
	public async getResolvedUri(): Promise<string> {
		if (!this.isDynamic) return this.uri;
		
		if (!this._resolvedUri) {
			this._resolvedUri = this.uri;
			const matches = this.uri.match(/\{\w+}/g);
			await Promise.all(matches.map(async match => {
				const field = match.substring(1, match.length - 1);
				const catalog = RequestContext.get('catalog') as Catalog;
				const value = await catalog.get(field).getValue();

				if (typeof value !== 'string') throw new CustomError(`Unable to use non-string value "${value}" of catalog field "${field}" in dynamic uri of data source "${this.id}"`);

				this._resolvedUri = this._resolvedUri.replaceAll(match, value);
			}));
		}
		
		return this._resolvedUri;
	}
	
	public async getItems(): Promise<DataSourceItem[]> {
		this._items ??= await this.platformBehavior.getItems();
		
		if (!this._items.length) throw new CustomError(`Data source "${this.id}" contains no items`);
		
		return this._items;
	}
	
	public async getContents(): Promise<typeof DataSource.Contents> {
		const items = await this.getItems();
		
		return await Promise.all(items.map(item => item.getContent()));
	}
	
	public async read(): Promise<string | AsyncGenerator<JsonObject> | DataSourceItem[]> {
		return Profiler.run(async () => await this.targetBehavior.read(), `read data source "${this.id}"`);
	}
	
	public async ingest(): Promise<void> {
		if (this.isDynamic) return console.warn(`Not ingesting dynamic data source "${this.id}"`);
		
		return this.targetBehavior.ingest();
	}
	
	public async getIngestedData(): Promise<string | AsyncGenerator<JsonObject> | void> {
		return await this.targetBehavior.getIngestedData();
	}
	
	public async getData(): Promise<string | AsyncGenerator<JsonObject> | DataSourceItem[]> {
		return this._data ??= this.targetBehavior.getData();
	}
	
	public async query(parameters: typeof StructuredDataSourceBehavior.QueryParameters): Promise<string | JsonArray | DataSourceItem[]> {
		return Profiler.run(async () => await this.targetBehavior.query(parameters), `query data source "${this.id}"`);
	}
}
