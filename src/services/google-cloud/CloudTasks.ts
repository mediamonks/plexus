import { v2 } from '@google-cloud/tasks';
import Config from '../../core/Config';

type Configuration = {
	projectId: string;
	location: string;
};

export default class CloudTasks {
	private static _client: v2.CloudTasksClient = new v2.CloudTasksClient();
	
	public static async create(queue: string, endpoint: string, payload: any): Promise<any> {
		const { projectId, location } = Config.get('tasks', { includeGlobal: true, includeRequest: false }) as Configuration;
		const parent = this._client.queuePath(projectId, location, queue);
		const url = `https://${location}-${projectId}.cloudfunctions.net/api/${endpoint}`;
		
		return this._client.createTask({
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
	
	public static async delegate(fn: string, args: any[]): Promise<void> {
		await this.create('delegated-functions', 'delegate', { fn, args });
	}
};
