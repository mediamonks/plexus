import fs from 'node:fs/promises';
import path from 'node:path';
import { Storage, File, Bucket } from '@google-cloud/storage';
import IHasLocalFileCache from '../IHasLocalFileCache';
import LocalFileCache from '../LocalFileCache';
import Config from '../../core/Config';
import Profiler from '../../core/Profiler';
import CustomError from '../../entities/error-handling/CustomError';
import { staticImplements } from '../../types/common';

const GS_URI_PATTERN = /gs:\/\/([^/]+)\/(.*)/;

@staticImplements<IHasLocalFileCache<string>>()
export default class CloudStorage {
	private static _client: Storage;
	
	public static async read(uri: string): Promise<string> {
		const [buffer] = await this.file(uri).download();
		return buffer.toString();
	}
	
	public static async write(uri: string, contents: string): Promise<string> {
		return new Promise((resolve, reject) => {
			const stream = this.file(uri).createWriteStream();
			stream.on('error', reject);
			stream.on('finish', () => resolve(uri));
			stream.write(contents);
			stream.end();
		});
	}
	
	public static async upload(filePath: string, uri: string): Promise<string> {
		const destination = this.uri(uri).path;
		await this.bucket(uri).upload(filePath, { destination });
		return uri;
	}
	
	public static async list(uri: string): Promise<string[]> {
		const files = await this.files(uri);
		return files.map(file => file.cloudStorageURI.toString());
	}
	
	public static async download(uri: string, destination?: string): Promise<string> {
		return Profiler.run(async () => {
			// TODO why is there still URI encoding in `destination`?
			destination ??= path.join(Config.get('tempPath') as string, 'download', 'gcs', this.uri(uri).bucket, this.uri(uri).path);
			
			await fs.mkdir(path.dirname(destination), { recursive: true });
			
			await this.file(uri).download({ destination });
			
			return destination;
		}, `download gcs file "${uri}"`);
	}
	
	public static async downloadAll(uri: string, destination?: string): Promise<void> {
		const files = await this.files(uri);
		await Promise.all(files.map(file => this.download(
			file.cloudStorageURI.toString(),
			destination && path.join(destination, file.name),
		)));
	}
	
	public static async cache(uri: string, destination?: string): Promise<string> {
		destination ??= path.join(this.downloadPath, this.uri(uri).bucket, this.uri(uri).path);
		
		return LocalFileCache.get(uri, destination, this);
	}
	
	public static async cacheAll(uri: string, destination?: string): Promise<string[]> {
		const files = await this.files(uri);
		return Promise.all(files.map(file => this.cache(
			file.cloudStorageURI.toString(),
			destination && path.join(destination, file.name),
		)));
	}
	
	public static isFolder(uri: string): boolean {
		return uri.endsWith('/');
	}
	
	private static get client(): Storage {
		return this._client ??= new Storage();
	}
	
	private static get downloadPath(): string {
		return path.join(Config.get('tempPath'), 'download', 'gcs');
	}
	
	private static uri(uri: string): { bucket: string; path: string } {
		const components = GS_URI_PATTERN.exec(decodeURIComponent(uri));
		if (!components) throw new CustomError(`Invalid Google Cloud Storage URI: ${uri}`);
		const [, bucket, path] = GS_URI_PATTERN.exec(decodeURIComponent(uri));
		return { bucket, path };
	}
	
	private static async files(uri: string): Promise<File[]> {
		const prefix = this.uri(uri).path;
		
		const [files] = await this.bucket(uri).getFiles({ prefix });
		
		return files.filter(file => file.name !== `${prefix}/`);
	}
	
	private static file(uri: string): File {
		const parts = this.uri(uri);
		return this.client.bucket(parts.bucket).file(parts.path);
	}
	
	private static bucket(uri: string): Bucket {
		return this.client.bucket(this.uri(uri).bucket);
	}
};
