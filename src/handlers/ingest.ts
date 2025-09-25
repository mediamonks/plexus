import DataSources from '../entities/data-sources/DataSources';

export default async ({ namespace }: { namespace: string }): Promise<void> => {
	await DataSources.ingest(namespace);
};
