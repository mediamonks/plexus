const fs = require('node:fs');
const path = require('node:path');
const { google } = require('googleapis');
const mime = require('mime-types');
const workspace = require('./workspace');
const config = require('../utils/config');
const Profiler = require('../utils/Profiler');

const tempPath = config.get('tempPath');
// TODO download to sources/ directory just like gcs??
const DOWNLOAD_PATH = path.resolve(tempPath, 'download/');

module.exports = auth => {
	const drive = google.drive({ version: 'v3', auth });
	
	async function createFile(name, folderId, mimeType, body) {
		await workspace.quotaDelay(workspace.SERVICE.DRIVE, workspace.OPERATION.WRITE);
		
		const file = await drive.files.create({
			resource: {
				name,
				parents: [folderId],
				mimeType,
			},
			media: body && {
				mimeType,
				body,
			},
			fields: 'id, name, webViewLink, webContentLink',
			supportsAllDrives: true
		});
		
		return body ? file.data.webViewLink : file.data.id;
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
	
	async function downloadFile(file) {
		await workspace.quotaDelay();
		
		try {
			const fileStream = await drive.files.get(
					{ fileId: file.id, alt: 'media' },
					{ responseType: 'stream' }
			);
			
			fs.mkdirSync(DOWNLOAD_PATH, { recursive: true });
			const destPath = path.join(DOWNLOAD_PATH, file.name);
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
	
	async function listFolderContents(folderId, mimeType) {
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
	
	async function exportFile(file, type) {
		const mimeType = mime.types[type];
		
		await workspace.quotaDelay();
		
		const fileStream = await drive.files.export({
			fileId: file.id,
			mimeType,
		}, { responseType: 'stream' });
		
		fs.mkdirSync(DOWNLOAD_PATH, { recursive: true });
		const destPath = path.join(DOWNLOAD_PATH, `${file.name.replace(/\W+/g, '_')}.${type}`);
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
	
	// TODO abstract common file cache logic (see storage.js)
	async function cacheFile(metadata) {
		const filePath = path.join(DOWNLOAD_PATH, metadata.name);
		fs.mkdirSync(path.dirname(filePath), { recursive: true });
		try {
			fs.accessSync(filePath);
		} catch (error) {
			await downloadFile(metadata);
		}
		return filePath;
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
	};
}
