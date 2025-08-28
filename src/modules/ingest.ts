import DataSources from '../entities/data-sources/DataSources';

export default async function ingest(namespace: string): Promise<void> {
	await DataSources.ingest(namespace);
}
