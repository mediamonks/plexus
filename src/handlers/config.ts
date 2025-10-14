import Config from '../core/Config';
import { JsonObject } from '../types/common';

export default async (): Promise<JsonObject> => Config.get() as JsonObject;
