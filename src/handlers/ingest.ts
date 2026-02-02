import Plexus from '../Plexus';

export default async ({ namespace }: { namespace: string }): Promise<void> => {
	return Plexus.instance.ingest(namespace);
};
