import config from '../utils/config';
import { JsonObject } from '../types/common';

export default async (): Promise<JsonObject> => config.get() as JsonObject;
