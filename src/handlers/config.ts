import Config from '../core/Config';
import { Configuration } from '../types/common';

export default async (): Promise<Configuration> => Config.get();
