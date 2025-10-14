import Config from '../core/Config';

export default async (_: any, { field }: { field: string }): Promise<any[]> => Object.values(Config.get('input-fields')[field]);
