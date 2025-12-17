import fs from 'node:fs/promises';
import path from 'node:path';
import IHasLocalFileCache from './IHasLocalFileCache';
import Config from '../core/Config';

export default class LocalFileCache {
	public static async get<TSource>(source: TSource, destination: string, parent: IHasLocalFileCache<TSource>): Promise<string> {
		await fs.mkdir(path.dirname(destination), { recursive: true });
		
		try {
			await fs.access(destination);
		} catch (error) {
			await parent.download(source, destination);
		}
		
		return destination;
	}
	
	public static async create(fileName: string, base64: string): Promise<string> {
		const destination = path.join(Config.get('tempPath'), 'local', fileName);
		
		await fs.mkdir(path.dirname(destination), { recursive: true });
		
		try {
			await fs.access(destination);
		} catch (error) {
			await fs.writeFile(destination, Buffer.from(base64, 'base64'));
		}
		return destination;
	}
};
