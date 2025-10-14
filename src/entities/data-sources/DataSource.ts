import ApiDataSourceOrigin from './origin/ApiDataSourceOrigin';
import DataSourceItem from './origin/DataSourceItem';
import DataSourceOrigin from './origin/DataSourceOrigin';
import GoogleDriveDataSourceOrigin from './origin/GoogleDriveDataSourceOrigin';
import GoogleCloudStorageDataSourceOrigin from './origin/GoogleCloudStorageDataSourceOrigin';
import Catalog from '../catalog/Catalog';
import DataSourceCatalogField from '../catalog/DataSourceCatalogField';
import CustomError from '../error-handling/CustomError';
import UnsupportedError from '../error-handling/UnsupportedError';
import RequestContext from '../../core/RequestContext';
import { JsonField, JsonObject, ValueOf } from '../../types/common';

export default abstract class DataSource {
	public constructor(
		private readonly _id: string,
		protected readonly _configuration: JsonObject,
	) {}
	
	public static readonly Configuration: {
		allowCache: boolean;
		isFolder: boolean;
		origin: ValueOf<typeof DataSource.ORIGIN>;
		dataType: ValueOf<typeof DataSource.DATA_TYPE>;
		target: ValueOf<typeof DataSource.TARGET>;
		uri: string;
		searchField: string;
		namespace: string;
	}	& typeof ApiDataSourceOrigin.Configuration;
	
	public static readonly DATA_TYPE = {
		UNSTRUCTURED: 'text',
		STRUCTURED: 'data',
		MIXED: undefined,
	} as const;

	public static readonly ORIGIN = {
		GOOGLE_DRIVE: 'drive',
		GOOGLE_CLOUD_STORAGE: 'gcs',
		API: 'api',
	} as const;

	public static readonly TARGET = {
		DIGEST: 'digest',
		FILE: 'file',
		FILES: 'files', // TODO for backwards compatibility
		VECTOR: 'vector',
		PROFILE: 'profile',
		RAW: 'raw',
	} as const;
	
	public static parseConfiguration(configuration: JsonObject): typeof DataSource.Configuration {
		const { type } = configuration;
		const [dataType, target] = typeof type === 'string' ? type.split(':') : [];
		
		return {
			allowCache: configuration.cache ?? true,
			isFolder: configuration.folder,
			origin: configuration.origin ?? configuration.platform, // TODO for backwards compatibility
			dataType: (configuration.dataType ?? dataType), // TODO for backwards compatibility
			target: (configuration.target ?? target), // TODO for backwards compatibility
			uri: configuration.uri ?? configuration.source, // TODO for backwards compatibility
			searchField: configuration.searchField,
			namespace: configuration.namespace,
		} as typeof DataSource.Configuration;
	}
	
	private _isDynamic?: boolean;
	private _origin?: DataSourceOrigin;
	private _resolvedUri?: string;
	
	public get id(): string {
		return this._id;
	}

	public get isDynamic(): boolean {
		const { uri } = this.configuration;
		return this._isDynamic ??= /\{\w+}/.test(uri);
	}

	public get configuration(): typeof DataSource.Configuration {
		return DataSource.parseConfiguration(this._configuration);
	}
	
	public get origin(): DataSourceOrigin {
		if (this._origin) return this._origin;
		
		const origin = this.configuration.origin ?? this.detectOrigin();
		
		const mapping = {
			[DataSource.ORIGIN.GOOGLE_DRIVE]: GoogleDriveDataSourceOrigin,
			[DataSource.ORIGIN.GOOGLE_CLOUD_STORAGE]: GoogleCloudStorageDataSourceOrigin,
			[DataSource.ORIGIN.API]: ApiDataSourceOrigin,
		};
		
		const originClass = mapping[origin];
		
		if (!originClass) throw new UnsupportedError('data source origin', origin, Object.keys(mapping));
		
		return this._origin = new originClass(this);
	}
	
	public abstract query(parameters?: typeof DataSourceCatalogField.QueryParameters): Promise<JsonField | DataSourceItem<unknown, unknown>[]>;
	
	public abstract ingest(): Promise<void>;
	
	public async getResolvedUri(): Promise<string> {
		if (this._resolvedUri) return this._resolvedUri;
		
		const { uri } = this.configuration;
		
		this._resolvedUri = uri;
		
		if (!this.isDynamic) return this._resolvedUri;

		const matches = uri.match(/\{\w+}/g);
		await Promise.all(matches.map(async match => {
			const field = match.substring(1, match.length - 1);
			const catalog = RequestContext.get('catalog') as Catalog;
			const value = await catalog.get(field).getValue();

			if (typeof value !== 'string') throw new CustomError(`Unable to use non-string value "${value}" of catalog field "${field}" in dynamic uri of data source "${this.id}"`);

			this._resolvedUri = this._resolvedUri.replaceAll(match, value);
		}));

		return this._resolvedUri;
	}
	
	private detectOrigin(): ValueOf<typeof DataSource.ORIGIN> {
		const mapping = {
			[DataSource.ORIGIN.GOOGLE_DRIVE]: /^https?:\/\/(?:drive|docs)\.google\.com\/(?:drive\/(folders)|(?:file|document|spreadsheets|presentation)\/d)\/([\w\-]+)/,
			[DataSource.ORIGIN.GOOGLE_CLOUD_STORAGE]: /^gs:\/\//,
			[DataSource.ORIGIN.API]: /^https?:\/\//
		};
		
		const origin = Object.keys(mapping)
			.find(origin => mapping[origin].test(this.configuration.uri)) as ValueOf<typeof DataSource.ORIGIN>;
		
		if (!origin) throw new UnsupportedError('data source URI', this.configuration.uri, Object.values(mapping).map(regex => regex.toString()));
		
		return origin;
	}
}
