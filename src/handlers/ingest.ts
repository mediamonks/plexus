import Plexus from '../Plexus';
import Configuration from '../types/Configuration';
import { JsonObject } from '../types/common';

export default async ({ namespace }: { namespace: string }, { config }: { config: Configuration }): Promise<JsonObject> => {
	return new Plexus(config).ingest(namespace);
};
