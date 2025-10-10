import { v2 } from '@google-cloud/tasks';
import config from '../utils/config';

const client = new v2.CloudTasksClient();

type Configuration = {
	projectId: string;
	location: string;
};

const { projectId, location } = config.get('tasks', { includeGlobal: true, includeRequest: false }) as Configuration;

async function create(queue: string, endpoint: string, payload: any): Promise<any> {
	const parent = client.queuePath(projectId, location, queue);
	const url = `https://${location}-${projectId}.cloudfunctions.net/api/${endpoint}`;
  
  return client.createTask({
    parent,
    task: {
      httpRequest: {
        headers: {
          'Content-Type': 'application/json',
        },
        httpMethod: 'POST',
        url,
        body: Buffer.from(JSON.stringify(payload)).toString('base64'),
      }
    }
  });
}

async function delegate(fn: string, args: any[]): Promise<void> {
	await create('delegated-functions', 'delegate', { fn, args });
}

export default {
  create,
	delegate,
};
