export default interface IHasLocalFileCache<TSource> {
	cache(source: TSource): Promise<string>;
	download(source: TSource, destination: string): Promise<string>;
};
