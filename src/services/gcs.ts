import fs from 'node:fs/promises';
import path from 'node:path';
import { Storage } from '@google-cloud/storage';
import config from '../utils/config';
import Profiler from '../utils/Profiler';

const storage = new Storage();

const GS_URI_PATTERN = /gs:\/\/([^/]+)\/(.*)/;

function getUriParts(uri: string): { bucket: string; path: string } {
	const [, bucket, path] = GS_URI_PATTERN.exec(uri);
	return { bucket, path };
}

function getFile(uri: string): any {
	const parts = getUriParts(uri);
	return storage.bucket(parts.bucket).file(parts.path);
}

function getBucket(uri: string): any {
	return storage.bucket(getUriParts(uri).bucket);
}

function getPath(uri: string): string {
	return getUriParts(uri).path;
}

async function read(uri: string): Promise<string> {
	return (await getFile(uri).download()).toString();
}

async function write(uri: string, contents: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const stream = getFile(uri).createWriteStream();
		stream.on('error', reject);
		stream.on('finish', () => resolve(uri));
		stream.write(contents);
		stream.end();
	});
}

async function upload(filePath: string, uri: string): Promise<string> {
	const destination = getPath(uri);
	await getBucket(uri).upload(filePath, { destination });
	return uri;
}

async function getFiles(uri: string): Promise<any[]> {
	const prefix = getPath(uri);
	
	const [files] = await getBucket(uri).getFiles({ prefix });

	return files.filter(file => file.name !== `${prefix}/`);
}

async function list(uri: string): Promise<string[]> {
	return (await getFiles(uri)).map(file => file.cloudStorageURI);
}

async function download(uri: string, destination?: string): Promise<string> {
	return Profiler.run(async () => {
		destination ??= path.join(config.get('tempPath') as string, 'download', 'gcs', getPath(uri));
		
		await fs.mkdir(path.dirname(destination), { recursive: true });
		
		await getFile(uri).download({ destination });
		
		return destination;
	}, `download gcs file "${uri}"`);
}

async function downloadAll(uri: string, destination?: string): Promise<void> {
	const files = await getFiles(uri);
	await Promise.all(files.map(file => download(file.cloudStorageURI, destination && path.join(destination, file.name))));
}

async function cache(uri: string, destination?: string): Promise<string> {
	destination ??= path.join(config.get('tempPath') as string, 'download', 'gcs', uri.replace(/^gs:\/\//, ''));
	
	try {
		await fs.access(destination);
	} catch (error) {
		await download(uri, destination);
	}
	
	return destination;
}

async function cacheAll(uri: string, destination?: string): Promise<string[]> {
	const files = await getFiles(uri);
	return Promise.all(files.map(file => cache(file.cloudStorageURI, destination && path.join(destination, file.name))));
}

function isFolder(uri: string): boolean {
	return uri.endsWith('/');
}

export default {
	read,
	write,
	upload,
	list,
	download,
	downloadAll,
	cache,
	cacheAll,
	isFolder,
};
