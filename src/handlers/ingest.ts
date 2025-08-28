import tasks from '../services/tasks';

export default async (_: any, { namespace }: { namespace: string }): Promise<void> => tasks.delegate('ingest', [namespace]);
