import Config from '../core/Config';

export default async (_: void, { field }: { field: string }): Promise<any[]> => Object.values(Config.get('input-fields')[field]);
