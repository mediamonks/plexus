const path = require('node:path');
const { Storage } = require('@google-cloud/storage');
const storageConfig = require('../../config/storage.json');
const fs = require('node:fs/promises');

const TEMP_PATH = './temp/';

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
	await storage.bucket(storageConfig.bucket).file(file).download({ destination });
}

async function downloadAll(prefix, destination) {
	const files = await list(prefix);
	await Promise.all(files.map(file => download(file.name, path.join(destination, file.name))));
}

async function cache(file) {
	const filePath = path.join(TEMP_PATH, file);
	try {
		await fs.access(filePath);
	} catch (error) {
		await download(file, filePath);
	}
	return filePath;
}

async function cacheAll(prefix) {
	const files = await list(prefix);
	return Promise.all(files.map(file => cache(file.name)));
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
};
