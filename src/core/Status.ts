import Config from './Config';
import Console from './Console';
import Configuration from '../types/Configuration';

export default class Status {
	public static send(message: string, isRunning?: boolean): void {
		switch (process.env['PLEXUS_MODE']) {
			case 'service':
				const postback = Config.get('postback') as Configuration['postback'];
				if (!postback?.url) return;
				
				fetch(postback.url, {
					method: 'POST',
					headers: postback.headers,
					body: JSON.stringify({ message, isRunning }),
				}).catch(() => undefined);
				break;
			case 'sdk':
				break;
			case 'cli':
			default:
				if (isRunning === undefined) Console.output(Console.OUTPUT_TYPE.STATUS,message);
				break;
		}
	}
	
	public static async wrap(message: string, fn?: () => Promise<any>): Promise<any> {
		this.send(message, fn && true);
		
		if (!fn) return;
		
		const activity = Console.start(message);
		
		const result = await fn();
		
		this.send(message, false);
		
		activity.done();
		
		return result;
	}
};
