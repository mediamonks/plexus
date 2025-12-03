import fs from 'node:fs/promises';
import path from 'node:path';
import IHasLocalFileCache from './IHasLocalFileCache';

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
};
