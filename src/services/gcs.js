const fs = require('node:fs/promises');
const path = require('node:path');
const { Storage } = require('@google-cloud/storage');
const config = require('../utils/config');

const storage = new Storage();

const GS_URI_PATTERN = /gs:\/\/([^/]+)\/(.+)/;

function getUriParts(uri) {
	const [, bucket, path] = GS_URI_PATTERN.exec(uri);
	return { bucket, path };
}

function getFile(uri) {
	const parts = getUriParts(uri);
	return storage.bucket(parts.bucket).file(parts.path);
}

function getBucket(uri) {
	return storage.bucket(getUriParts(uri).bucket);
}

function getPath(uri) {
	return getUriParts(uri).path;
}

async function read(uri) {
	return (await getFile(uri).download()).toString();
}

async function write(uri, contents) {
	return new Promise((resolve, reject) => {
		const stream = getFile(uri).createWriteStream();
		stream.on('error', reject);
		stream.on('finish', () => resolve(uri));
		stream.write(contents);
		stream.end();
	});
}

async function upload(filePath, uri) {
	const destination = getPath(uri);
	await getBucket(uri).upload(filePath, { destination });
	return uri;
}

async function getFiles(uri) {
	const prefix = getPath(uri);
	
	const [files] = await getBucket(uri).getFiles({ prefix });
	return files.filter(file => file.name !== `${prefix}/`);
}

async function list(uri) {
	return getFiles(uri).map(file => file.cloudStorageURI);
}

async function download(uri, destination) {
	destination ??= path.join(config.get('tempPath'), 'download', 'gcs', getPath(uri));
	
	await fs.mkdir(path.dirname(destination), { recursive: true });
	
	await getFile(uri).download({ destination });
}

async function downloadAll(uri, destination) {
	const files = await getFiles(uri);
	await Promise.all(files.map(file => download(file.cloudStorageURI, path.join(destination, file.name))));
}

async function cache(uri) {
	let destination;
	
	destination = path.join(config.get('tempPath'), 'download', 'gcs', file.replace(/^gs:\/\//, ''));
	
	try {
		await fs.access(destination);
	} catch (error) {
		await download(uri, destination);
	}
	
	return destination;
}

async function cacheAll(uri, destination) {
	const files = await getFiles(uri);
	return Promise.all(files.map(file => cache(file.cloudStorageURI, path.join(destination, file.name))));
}

function isFolder(uri) {
	return uri.endsWith('/');
}

module.exports = {
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
