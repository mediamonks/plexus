import fs from 'node:fs';
import path from 'node:path';
import { type drive_v3, google } from 'googleapis';
import mime from 'mime-types';
import { Readable } from 'stream';
import GoogleAuthClient from './GoogleAuthClient';
import GoogleWorkspace from './GoogleWorkspace';
import IHasLocalFileCache from '../IHasLocalFileCache';
import LocalFileCache from '../LocalFileCache';
import Config from '../../core/Config';
import Debug from '../../core/Debug';
import Profiler from '../../core/Profiler';
import CustomError from '../../entities/error-handling/CustomError';
import { Configuration, JsonObject, staticImplements } from '../../types/common';

const FIELDS = ['id', 'name', 'mimeType'];

const OPERATION = {
	CREATE: 'create',
	DELETE: 'delete',
	EXPORT: 'export',
	GET: 'get',
	LIST: 'list',
	UPDATE: 'update',
} as const;

const OPERATION_TYPE = {
	[OPERATION.CREATE]: GoogleWorkspace.OPERATION.WRITE,
	[OPERATION.DELETE]: GoogleWorkspace.OPERATION.WRITE,
	[OPERATION.EXPORT]: GoogleWorkspace.OPERATION.READ,
	[OPERATION.GET]: GoogleWorkspace.OPERATION.READ,
	[OPERATION.LIST]: GoogleWorkspace.OPERATION.READ,
	[OPERATION.UPDATE]: GoogleWorkspace.OPERATION.WRITE,
};

export type Metadata = drive_v3.Schema$File;

type OperationType = typeof OPERATION[keyof typeof OPERATION];

type MethodParams<TOperation extends OperationType> =
	TOperation extends 'create' ? drive_v3.Params$Resource$Files$Create :
	TOperation extends 'delete' ? drive_v3.Params$Resource$Files$Delete :
	TOperation extends 'export' ? drive_v3.Params$Resource$Files$Export :
	TOperation extends 'get' ? drive_v3.Params$Resource$Files$Get :
	TOperation extends 'list' ? drive_v3.Params$Resource$Files$List :
	TOperation extends 'update' ? drive_v3.Params$Resource$Files$Update :
	never;

type MethodResponse<TOperation extends OperationType> =
	TOperation extends 'create' ? Metadata :
	TOperation extends 'delete' ? void :
	TOperation extends 'export' ? Metadata | Readable :
	TOperation extends 'get' ? Metadata | Readable :
	TOperation extends 'list' ? drive_v3.Schema$FileList :
	TOperation extends 'update' ? void :
	never;

@staticImplements<IHasLocalFileCache<Metadata>>()
export default class GoogleDrive {
	private static _client: drive_v3.Drive;
	
	public static async upload(filePath: string, folderId: string): Promise<Metadata> {
		return await this.createFile(
			path.basename(filePath),
			folderId,
			mime.lookup(filePath) || 'application/octet-stream',
			fs.createReadStream(filePath),
		);
	}
	
	public static async download(metadata: Metadata, destination?: string): Promise<string> {
		Debug.log(`Downloading file "${metadata.name}"`, 'Google Drive');
		
		try {
			const fileStream = await this.execute(OPERATION.GET, {
				fileId: metadata.id,
				alt: 'media',
			}, { responseType: 'stream' }) as Readable;
			
			destination ??= path.join(this.downloadPath, `${metadata.id}${path.extname(metadata.name)}`);
			
			fs.mkdirSync(path.dirname(destination), { recursive: true });
			
			await new Promise<void>((resolve, reject) => {
				const writeStream = fs.createWriteStream(destination, { encoding: null });
				
				writeStream
					.on('error', error => {
						reject(new CustomError(`Error writing file "${destination}": ${error.message}`, 500));
					})
					.on('finish', resolve);
				
				fileStream
					.on('error', error => {
						reject(new CustomError(`Error reading file "${metadata.name}": ${error.message}`, 500));
					})
					.pipe(writeStream);
			});
			
			return destination;
		} catch (error) {
			throw new CustomError(`Error downloading file "${metadata.name}":`, error.message);
		}
	}
	
	public static async list(folderId: string): Promise<Metadata[]> {
		const list = [];
		let pageToken: string;
		
		do {
			const { files, nextPageToken } = await this.execute(OPERATION.LIST, {
				q: `'${folderId}' in parents and trashed = false`,
				fields: `nextPageToken, files(${this.fields}, shortcutDetails)`,
				spaces: 'drive',
				includeItemsFromAllDrives: true,
				pageSize: 1000,
				pageToken
			});
			
			for (const file of files) {
				if (file.mimeType !== 'application/vnd.google-apps.shortcut') {
					list.push(file);
					continue;
				}
				
				list.push({
					id: file.shortcutDetails.targetId,
					name: file.name,
					mimeType: file.shortcutDetails.targetMimeType,
				});
			}
			
			pageToken = nextPageToken;
		} while (pageToken);
		
		return list;
	}
	
	public static async import(metadata: Metadata, allowCache: boolean = false): Promise<Metadata> {
		const newName = `imported-${metadata.id}`;
		const cacheContents = await this.list(this.tempFolderId);
		const existingFile = cacheContents.find(cacheFile => cacheFile.name === newName);
		
		if (allowCache) Debug.log(`Import "${metadata.name}": cache ${existingFile ? 'hit' : 'miss'}`, 'Google Drive');
		if (existingFile && allowCache) return existingFile;
		if (existingFile) await this.trash(existingFile.id);
		
		const conversionMap = {
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'application/vnd.google-apps.spreadsheet',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'application/vnd.google-apps.document',
			'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'application/vnd.google-apps.presentation',
			'application/vnd.ms-excel': 'application/vnd.google-apps.spreadsheet',
			'application/msword': 'application/vnd.google-apps.document',
			'application/vnd.ms-powerpoint': 'application/vnd.google-apps.presentation',
		};
		
		const targetMimeType = conversionMap[metadata.mimeType];
		if (!targetMimeType) {
			throw new CustomError(`Cannot import file type ${metadata.mimeType}. Supported types: ${Object.keys(conversionMap).join(', ')}`);
		}
		
		Debug.log(`Importing file "${metadata.name}"`, 'Google Drive');
		
		const fileContent = await this.execute(OPERATION.GET, {
			fileId: metadata.id,
			alt: 'media'
		}, { responseType: 'stream' }) as Readable;
		
		const importedFile = await this.createFile(
			newName,
			this.tempFolderId,
			targetMimeType,
			fileContent,
			metadata.mimeType,
		);
		
		return {
			...importedFile,
			mimeType: targetMimeType
		};
	}
	
	public static async export(fileId: string, mimeType: string, destination?: string): Promise<string> {
		destination ??= path.join(this.downloadPath, `${fileId}.${mime.extension(mimeType)}`);
		
		let fileStream: Readable;
		try {
			fileStream = await this.execute(OPERATION.EXPORT, {
				fileId,
				mimeType,
			}, { responseType: 'stream' }) as Readable;
		} catch (error) {
			throw new CustomError(`Error exporting file with ID "${fileId}": ${error.message}`);
		}
		
		fs.mkdirSync(path.dirname(destination), { recursive: true });
		
		const writeStream = fs.createWriteStream(destination);
		
		await new Promise((resolve, reject) => {
			fileStream
				.on('end', resolve)
				.on('error', reject)
				.pipe(writeStream);
		});
		
		return destination;
	}
	
	public static async exportToPdf(metadata: Metadata, allowCache = false): Promise<string> {
		const destination = path.join(this.downloadPath, `${metadata.id}.pdf`);
		
		if (allowCache && fs.existsSync(destination)) return destination;
		
		Debug.log(`Exporting file "${metadata.name}"`, 'Google Drive');
		
		return this.export(metadata.id, mime.lookup('pdf') as string, destination);
	}
	
	public static async isFolder(id: string): Promise<boolean> {
		const { mimeType } = await this.getMetadata(id);
		
		return (mimeType === 'application/vnd.google-apps.folder');
	}
	
	public static async getMetadata(id: string): Promise<Metadata> {
		return await this.execute(OPERATION.GET, {
			fileId: id,
			fields: this.fields,
		}) as Metadata;
	}
	
	// TODO abstract common file get logic (see CloudStorage.ts) with a LocalFileCache class
	public static async cache(metadata: Metadata): Promise<string> {
		const destination = path.join(this.downloadPath, `${metadata.id}.${mime.extension(metadata.mimeType)}`);
		
		return LocalFileCache.get(metadata, destination, this);
	}
	
	public static async convertToPdf(localPath: string): Promise<string> {
		const uploadedFileMetadata = await this.upload(localPath, this.tempFolderId);
		
		const importedFileMetadata = await this.import(uploadedFileMetadata);
		
		void this.trash(uploadedFileMetadata.id);
		
		const pathToPdf = await this.exportToPdf(importedFileMetadata);
		
		void this.trash(importedFileMetadata.id);
		
		return pathToPdf;
	}
	
	public static async createFile(name: string, folderId: string, mimeType: string, content?: Buffer | Readable | string, mediaMimeType?: string): Promise<Metadata> {
		let body = content;
		
		if (content instanceof Buffer) body = new Readable({
			read() {
				this.push(content);
				this.push(null);
			}
		});
		
		const media = body && {
			mimeType: mediaMimeType || mimeType,
			body,
		};
		
		return await this.execute(OPERATION.CREATE, {
			requestBody: {
				name,
				parents: [folderId],
				mimeType,
			},
			media,
			fields: this.fields,
		}) as Metadata;
	}
	
	public static async getContent(metadata: Metadata): Promise<Buffer> {
		const fileContent = await this.execute(OPERATION.GET, {
			fileId: metadata.id,
			alt: 'media',
		}, { responseType: 'stream' }) as Readable;
		
		return await new Promise<Buffer>((resolve, reject) => {
			const buffer: Buffer[] = [];
			
			fileContent
				.on('data', chunk => buffer.push(chunk))
				.on('end', () => resolve(Buffer.concat(buffer)))
				.on('error', reject);
		});
	}
	
	private static get configuration(): Configuration['drive'] {
		return Config.get('drive', { includeGlobal: true });
	}
	
	private static get fields() {
		return FIELDS.join(', ');
	}
	
	private static get downloadPath(): string {
		return path.join(this.configuration.tempPath, 'download', 'drive');
	}
	
	private static get tempFolderId(): string {
		return this.configuration.tempFolderId;
	}
	
	private static async getClient(): Promise<drive_v3.Drive> {
		if (this._client) return this._client;
		const auth = await GoogleAuthClient.get();
		return this._client = google.drive({ version: 'v3', auth });
	}
	
	private static async trash(id: string): Promise<void> {
		await this.execute(OPERATION.UPDATE, {
			fileId: id,
			requestBody: { trashed: true }
		});
	}
	
	private static async delete(id: string): Promise<void> {
		await this.execute(OPERATION.DELETE, {
			fileId: id,
		});
	}
	
	private static async execute<TOperation extends OperationType>(
		operation: TOperation,
		params: MethodParams<TOperation>,
		options?: JsonObject,
	): Promise<MethodResponse<TOperation>> {
		await Profiler.run(
			() => GoogleWorkspace.quotaDelay(GoogleWorkspace.SERVICE.GOOGLE_DRIVE, OPERATION_TYPE[operation]),
			'Google Drive quota delay',
		);
		
		return await Profiler.run(
			() => this._execute(operation, params, options),
			`Google Drive execute operation "${operation}"`,
		);
	}
	
	private static async _execute<TOperation extends OperationType>(
		operation: TOperation,
		params: MethodParams<TOperation>,
		options?: JsonObject,
	): Promise<MethodResponse<TOperation>> {
		const client = await this.getClient();
		const method = client.files[operation].bind(client.files);
		const result = await method({ ...params, supportsAllDrives: true }, options);
		
		return result.data;
	}
}
