import DataSources from '../entities/data-sources/DataSources';

export default async (_: any, { namespace }: { namespace: string }): Promise<void> => {
	await DataSources.ingest(namespace);
};
