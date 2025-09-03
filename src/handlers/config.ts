import config from '../utils/config.js';
import { JsonObject } from '../types/common.js';

export default async (): Promise<JsonObject> => config.get() as JsonObject;
