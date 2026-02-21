import Plexus from '../core/Plexus';
import Configuration from '../types/Configuration';
import { JsonObject } from '../types/common';

export default async (_: void, { config }: { config: Configuration }): Promise<JsonObject> => {
	return new Plexus(config).config as JsonObject;
}
