import Config from '../core/Config';
import { JsonArray } from '../types/common';

export default async (_: void, { field }: { field: string }): Promise<JsonArray> => Object.values(Config.get('input-fields')[field]);
