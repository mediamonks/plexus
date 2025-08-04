const fs = require('node:fs/promises');
const path = require('node:path');
const { Storage } = require('@google-cloud/storage');
const config = require('../utils/config');
const Profiler = require('../utils/Profiler');

// TODO get all config at invoke time to ensure runtime config is respected
const storageConfig = config.get('storage');
const tempPath = config.get('tempPath');

const storage = new Storage();

async function read(file) {
	return (await storage.bucket(storageConfig.bucket).file(file).download()).toString();
}

async function write(file, contents) {
	return new Promise((resolve, reject) => {
		const stream = storage.bucket(storageConfig.bucket).file(file).createWriteStream();
		stream.on('error', reject);
		stream.on('finish', () => resolve(`gs://${storageConfig.bucket}/${file}`));
		stream.write(contents);
		stream.end();
	});
}

async function upload(filePath, destination) {
	await storage.bucket(storageConfig.bucket).upload(filePath, { destination });
	return `gs://${storageConfig.bucket}/${destination}`;
}

async function list(prefix) {
	const [files] = await storage.bucket(storageConfig.bucket).getFiles({ prefix });
	return files.filter(file => file.name !== `${prefix}/`);
}

async function download(file, destination) {
	let bucket;
	
	if (file.startsWith('gs://')) {
		bucket = file.substring(5, file.indexOf('/', 5));
		destination ??= path.join(tempPath, 'download', 'gcs', file.replace(/^gs:\/\//, ''));
	} else {
		bucket = storageConfig.bucket;
		destination ??= path.join(tempPath, file);
	}
	
	await fs.mkdir(path.dirname(destination), { recursive: true });
	
	await storage.bucket(bucket).file(file).download({ destination });
}

async function downloadAll(prefix, destination) {
	const files = await list(prefix);
	await Promise.all(files.map(file => download(file.name, path.join(destination, file.name))));
}

async function cache(file) {
	let destination;
	
	if (file.startsWith('gs://')) {
		destination = path.join('download', 'gcs', file.replace(/^gs:\/\//, ''));
	} else {
		destination = file;
	}
	
	destination = path.join(tempPath, destination);
	
	try {
		await fs.access(destination);
	} catch (error) {
		await download(file, destination);
	}
	
	return destination;
}

async function cacheAll(prefix, destination) {
	const files = await list(prefix);
	return Promise.all(files.map(file => cache(file.name, path.join(destination, file.name))));
}

async function isFolder(path) {
	return Profiler.run(async () => {
		const normalizedPath = path.endsWith('/') ? path : `${path}/`;
		
		const [exists] = await storage.bucket(storageConfig.bucket).file(normalizedPath).exists();
		if (exists) return true;
		
		const [files] = await storage.bucket(storageConfig.bucket).getFiles({
			prefix: normalizedPath,
			maxResults: 1
		});
		
		return files.length > 0;
	}, 'storage.isFolder');
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
