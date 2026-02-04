import Plexus from '../Plexus';
import Configuration from '../types/Configuration';

export default async (_: void, { config }: { config: Configuration }): Promise<Configuration> => {
	return new Plexus(config).config;
}
