import Plexus from '../Plexus';
import Configuration from '../types/Configuration';

export default async ({ namespace }: { namespace: string }, { config }: { config: Configuration }): Promise<void> => {
	return new Plexus(config).ingest(namespace);
};
