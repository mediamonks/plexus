import fs from 'node:fs';
import path from 'node:path';
import { google } from 'googleapis';
import type { drive_v3 } from 'googleapis';
import mime from 'mime-types';
import { Readable } from 'stream';
import authenticate from './auth';
import workspace from './workspace';
import config from '../utils/config';
import Debug from '../utils/Debug';
import Profiler from '../utils/Profiler';

const tempPath = config.get('tempPath');
// TODO download to sources/ directory just like gcs??
const DOWNLOAD_PATH = path.join(tempPath, 'download', 'drive');
const TEMP_FOLDER_ID = '1GAohqXcRbIyu-Nk86GQxfRBAKAJtq_6y';

export default async () => {
	const auth = await authenticate();
	const drive = google.drive({ version: 'v3', auth });
	
	async function createFile(name, folderId, mimeType, body, mediaMimeType) {
		await workspace.quotaDelay(workspace.SERVICE.DRIVE, workspace.OPERATION.WRITE);
		
		const response = await drive.files.create({
			resource: {
				name,
				parents: [folderId],
				mimeType,
			},
			media: body && {
				mimeType: mediaMimeType || mimeType,
				body: body instanceof Buffer ? new Readable({
					read() {
						this.push(body);
						this.push(null);
					}
				}) : body,
			},
			fields: 'id, name, webViewLink, webContentLink',
			supportsAllDrives: true
		});
		
		return response.data;
	}
	
	async function uploadFile(filePath, folderId) {
		return await createFile(
				filePath.split('/').pop(),
				folderId,
				mime.lookup(filePath) || 'application/octet-stream',
				fs.createReadStream(filePath)
		);
	}
	
	async function createFolder(folderName, parentFolderId) {
		const fileMetadata = {
			name: folderName,
			mimeType: 'application/vnd.google-apps.folder',
			parents: [parentFolderId],
		};
		
		await workspace.quotaDelay(workspace.SERVICE.DRIVE, workspace.OPERATION.WRITE);
		
		try {
			const folder = await drive.files.create({
				resource: fileMetadata,
				fields: 'id, name, webViewLink',
				supportsAllDrives: true
			});
			
			return folder.data.id;
		} catch (error) {
			console.error('Error creating folder:', error.message);
		}
	}
	
	async function getFolderId(name, parentFolderId) {
		await workspace.quotaDelay();
		
		const res = await drive.files.list({
			q: `name='${name}' and mimeType='application/vnd.google-apps.folder' and '${parentFolderId}' in parents and trashed=false`,
			fields: 'files(id, name)',
			spaces: 'drive',
			supportsAllDrives: true,
			includeItemsFromAllDrives: true,
		});
		
		return res.data.files[0]?.id;
	}
	
	async function downloadFile(file: drive_v3.Schema$File, destPath?: string) {
		Debug.log(`Downloading file "${file.name}"`, 'Google Drive');
		
		await workspace.quotaDelay();
		
		try {
			const fileStream = await drive.files.get(
					{ fileId: file.id, alt: 'media' },
					{ responseType: 'stream' }
			);
			
			destPath ??= path.join(DOWNLOAD_PATH, `${file.id}${path.extname(file.name)}`);
			fs.mkdirSync(path.dirname(destPath), { recursive: true });
			
			const writeStream = fs.createWriteStream(destPath, { encoding: null });
			
			await new Promise((resolve, reject) => {
				fileStream.data
						.on('end', resolve)
						.on('error', reject)
						.pipe(writeStream);
			});
			
			return destPath;
		} catch (error) {
			console.error(`Error downloading file "${file.name}":`, error.message);
		}
	}
	
	async function listFolderContents(folderId: string, mimeType?: string) {
		const files = [];
		let pageToken;
		
		do {
			await workspace.quotaDelay();
			
			const response = await drive.files.list({
				q: `'${folderId}' in parents and trashed = false`,
				fields: 'nextPageToken, files(id, name, mimeType, shortcutDetails)',
				spaces: 'drive',
				supportsAllDrives: true,
				includeItemsFromAllDrives: true,
				pageSize: 1000,
				pageToken
			});
			
			// TODO rewrite following shortcuts so it doesn't rely on mimeType
			for (const file of response.data.files) {
				if (file.mimeType !== 'application/vnd.google-apps.shortcut') {
					files.push(file);
					continue;
				}
				
				if (file.shortcutDetails.targetMimeType !== mimeType) continue;
				
				files.push({
					name: file.name,
					id: file.shortcutDetails.targetId,
					mimeType,
					shortcutId: file.id
				});
			}
			
			pageToken = response.data.nextPageToken;
		} while (pageToken);
		
		return files;
	}
	
	async function downloadFolderContents(folderId) {
		fs.mkdirSync(DOWNLOAD_PATH, { recursive: true });

		const files = await listFolderContents(folderId);

		const downloadableFiles = files.filter(file => !file.mimeType.startsWith('application/vnd.google-apps.'));

		return await Promise.all(downloadableFiles.map(downloadFile));
	}
	
	async function exportFolderContents(folderId, type) {
		fs.mkdirSync(DOWNLOAD_PATH, { recursive: true });
		
		const files = await listFolderContents(folderId);
		
		return await Promise.all(files.map(file => exportFile(file, type)));
	}
	
	async function importFile(file, allowCache) {
		const newName = `imported-${file.id}`;
		const cacheContents = await listFolderContents(TEMP_FOLDER_ID);
		const existingFile = cacheContents.find(cacheFile => cacheFile.name === newName);
		
		if (allowCache) console.debug('[Drive] Import', file.name, 'cache', existingFile ? 'hit' : 'miss');
		if (existingFile && allowCache) return existingFile;
		if (existingFile) await trashItem(existingFile.id);
		
		const conversionMap = {
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'application/vnd.google-apps.spreadsheet',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'application/vnd.google-apps.document',
			'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'application/vnd.google-apps.presentation',
			'application/vnd.ms-excel': 'application/vnd.google-apps.spreadsheet',
			'application/msword': 'application/vnd.google-apps.document',
			'application/vnd.ms-powerpoint': 'application/vnd.google-apps.presentation',
		};
		
		const targetMimeType = conversionMap[file.mimeType];
		if (!targetMimeType) {
			throw new Error(`Cannot import file type ${file.mimeType}. Supported types: ${Object.keys(conversionMap).join(', ')}`);
		}
		
		Debug.log(`Importing file "${file.name}"`, 'Google Drive');
		
		await workspace.quotaDelay(workspace.SERVICE.DRIVE, workspace.OPERATION.WRITE);
		
		const fileContent = await drive.files.get({
			fileId: file.id,
			alt: 'media'
		}, { responseType: 'stream' });
		
		const chunks = [];
		for await (const chunk of fileContent.data) {
			chunks.push(chunk);
		}
		const buffer = Buffer.concat(chunks); // TODO use fileContent.data directly?
		
		const importedFile = await createFile(
			newName,
			TEMP_FOLDER_ID,
			targetMimeType,
			buffer,
			file.mimeType,
		);
		
		return {
			...importedFile,
			mimeType: targetMimeType
		};
	}
	
	async function exportFile(file, type, allowCache) {
		const mimeType = mime.lookup(type);
		
		if (!mimeType) throw new Error(`Cannot export file type ${type}. Supported types: ${Object.keys(mime.types).join(', ')}`);
		
		const destPath = path.join(DOWNLOAD_PATH, `${file.id}.${type}`);
		
		if (allowCache && fs.existsSync(destPath)) return destPath;
		
		Debug.log(`Exporting file "${file.name}"`, 'Google Drive');
		
		await workspace.quotaDelay();
		
		let fileStream;
		try {
			fileStream = await drive.files.export({
				fileId: file.id,
				mimeType,
			}, { responseType: 'stream' });
		} catch (error) {
			throw new Error(`Error exporting file "${file.name}": ${error.message}`);
		}
		
		fs.mkdirSync(DOWNLOAD_PATH, { recursive: true });
		
		const writeStream = fs.createWriteStream(destPath);
		
		await new Promise((resolve, reject) => {
			fileStream.data
					.on('end', resolve)
					.on('error', reject)
					.pipe(writeStream);
		});
		
		return destPath;
	}
	
	async function createLink(targetId, folderId, name) {
		if (!name) {
			await workspace.quotaDelay();
			
			const file = await drive.files.get({
				fileId: targetId,
				fields: 'name',
				supportsAllDrives: true
			});
			name = file.data.name;
		}
		
		await workspace.quotaDelay(workspace.SERVICE.DRIVE, workspace.OPERATION.WRITE);
		
		const response = await drive.files.create({
			resource: {
				name,
				mimeType: 'application/vnd.google-apps.shortcut',
				shortcutDetails: {
					targetId
				},
				parents: [folderId]
			},
			fields: 'id,name,webViewLink',
			supportsAllDrives: true
		});

		return response.data.webViewLink;
	}
	
	async function createCsvFile(csvString, fileName, folderId) {
		const buffer = Buffer.from(csvString);
		
		return await createFile(
			fileName || 'data.csv',
			folderId,
			'text/csv',
			buffer
		);
	}
	
	async function isFolder(id) {
		return Profiler.run(async () => {
			await workspace.quotaDelay();
			
			const response = await drive.files.get({
				fileId: id,
				fields: 'mimeType',
				supportsAllDrives: true
			});
			
			const mimeType = response.data.mimeType;
			
			return (mimeType === 'application/vnd.google-apps.folder');
		}, 'drive.isFolder');
	}
	
	async function getFileMetadata(id) {
		await workspace.quotaDelay();
		
		const response = await drive.files.get({
			fileId: id,
			fields: 'id,name,mimeType,webViewLink,webContentLink,size,createdTime,modifiedTime',
			supportsAllDrives: true
		});
		
		return response.data;
	}
	
	// TODO abstract common file cache logic (see gcs.js)
	async function cacheFile(metadata) {
		const filePath = path.join(DOWNLOAD_PATH, `${metadata.id}.${mime.extension(metadata.mimeType)}`);
		fs.mkdirSync(DOWNLOAD_PATH, { recursive: true });
		try {
			fs.accessSync(filePath);
		} catch (error) {
			await downloadFile(metadata, filePath);
		}
		return filePath;
	}
	
	async function trashItem(id) {
		await workspace.quotaDelay(workspace.SERVICE.DRIVE, workspace.OPERATION.WRITE);
		
		await drive.files.update({
			fileId: id,
			resource: { trashed: true },
			supportsAllDrives: true,
		});
	}
	
	async function deleteFile(id) {
		await workspace.quotaDelay(workspace.SERVICE.DRIVE, workspace.OPERATION.WRITE);
		
		await drive.files.delete({
			fileId: id,
			supportsAllDrives: true,
		});
	}
	
	return {
		uploadFile,
		createFolder,
		getFolderId,
		downloadFile,
		listFolderContents,
		downloadFolderContents,
		exportFolderContents,
		exportFile,
		createFile,
		createLink,
		createCsvFile,
		isFolder,
		getFileMetadata,
		cacheFile,
		importFile,
	};
}
