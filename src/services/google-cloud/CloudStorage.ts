import fs from 'node:fs/promises';
import path from 'node:path';
import { Storage, File, Bucket } from '@google-cloud/storage';
import IHasLocalFileCache from '../IHasLocalFileCache';
import LocalFileCache from '../LocalFileCache';
import Config from '../../core/Config';
import Profiler from '../../core/Profiler';
import CustomError from '../../entities/error-handling/CustomError';
import { staticImplements } from '../../types/common';
import credentials from '../../../auth/plexus.json';

class CloudStorageFile extends File {
	public uri: string
}

const GS_URI_PATTERN = /gs:\/\/([^/]+)\/?(.*)/;

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
	
	public static async upload(filePath: string, uri: string, metadata?: Record<string, string>): Promise<string> {
		const destination = this.uri(uri).path;
		await this.bucket(uri).upload(filePath, { destination });
		if (metadata) await this.file(uri).setMetadata({ metadata });
		return uri;
	}
	
	public static async list(uri: string): Promise<string[]> {
		const files = await this.files(uri);
		return files.map(file => file.uri);
	}
	
	public static async download(uri: string, destination?: string): Promise<string> {
		return Profiler.run(async () => {
			// TODO why is there still URI encoding in `destination`?
			destination ??= path.join(Config.get('tempPath') as string, 'download', 'gcs', this.uri(uri).bucket, this.uri(uri).path);
			
			await fs.mkdir(path.dirname(destination), { recursive: true });
			
			await this.file(uri).download({ destination });
			
			return destination;
		}, `gcs.download file "${uri}"`);
	}
	
	public static async downloadAll(uri: string, destination?: string): Promise<void> {
		const files = await this.files(uri);
		await Promise.all(files.map(file => this.download(
			file.uri,
			destination && path.join(destination, file.name),
		)));
	}
	
	public static async cache(uri: string, destination?: string): Promise<string> {
		return Profiler.run(() => {
			destination ??= path.join(this.downloadPath, this.uri(uri).bucket, this.uri(uri).path);
			
			return LocalFileCache.get(uri, destination, this);
		}, `gcs.cache "${uri}"`);
	}
	
	public static async cacheAll(uri: string, destination?: string): Promise<string[]> {
		const files = await this.files(uri);
		return Promise.all(files.map(file => this.cache(
			file.uri,
			destination && path.join(destination, file.name),
		)));
	}
	
	public static isFolder(uri: string): boolean {
		return uri.endsWith('/');
	}
	
	public static async files(uri: string): Promise<CloudStorageFile[]> {
		return Profiler.run(async () => {
			const prefix = this.uri(uri).path;
			
			let [files] = await this.bucket(uri).getFiles({ prefix });
			
			files = files.filter(file => file.name !== `${prefix}/`);
			
			const result: CloudStorageFile[] = [];
			
			for (const file of files) {
				if (file.name === `${prefix}/`) continue;
				const cloudStorageFile = file as CloudStorageFile;
				cloudStorageFile.uri = decodeURIComponent(file.cloudStorageURI.toString());
				result.push(cloudStorageFile);
			}
			
			return result;
		}, `gcs.files "${uri}"`);
	}
	
	public static async getSize(uri: string): Promise<number> {
		const metadata = await this.file(uri).getMetadata();
		return +metadata[0].size;
	}
	
	public static async getContent(uri: string): Promise<Buffer> {
		return Profiler.run(async () => {
			const [buffer] = await this.file(uri).download();
			return buffer;
		}, `gcs.getContent "${uri}"`);
	}
	
	public static async delete(uri: string): Promise<void> {
		await this.file(uri).delete();
	}
	
	public static async getSignedUrl(uri: string): Promise<string> {
		const client = new Storage({ credentials });
		
		const [url] = await client.bucket(this.uri(uri).bucket)
			.file(this.uri(uri).path)
			.getSignedUrl({
				version: 'v4',
				action: 'read',
				expires: Date.now() + 15 * 60 * 1000,
			});
		
		return url;
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
	
	private static file(uri: string): File {
		const parts = this.uri(uri);
		return this.client.bucket(parts.bucket).file(parts.path);
	}
	
	private static bucket(uri: string): Bucket {
		return this.client.bucket(this.uri(uri).bucket);
	}
};
