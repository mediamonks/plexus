import Config from '../core/Config';
import Configuration from '../types/Configuration';

export default async (): Promise<Configuration> => Config.get();
