import config from '../utils/config';

export default async (_: any, { field }: { field: string }): Promise<any[]> => Object.values(config.get('input-fields')[field]);
