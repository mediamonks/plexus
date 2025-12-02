import Config from './Config';
import { Configuration } from '../types/common';

export default class Status {
	public static send(message: string, isRunning?: boolean): void {
		const postback = Config.get('postback') as Configuration['postback'];
		if (!postback?.url) return;
		
		fetch(postback.url, {
			method: 'POST',
			headers: postback.headers,
			body: JSON.stringify({ message, isRunning }),
		}).catch(() => undefined);
	}
	
	public static async wrap(message: string, fn?: () => Promise<any>): Promise<any> {
		this.send(message, fn && true);
		
		if (!fn) return;
		
		const result = await fn();
		
		this.send(message, false);
		
		return result;
	}
};
