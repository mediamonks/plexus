import Config from './Config';
import Configuration from '../types/Configuration';
import Console from './Console';

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
				else isRunning ? Console.activity(message) : Console.done();
				break;
		}
	}
	
	public static async wrap(message: string, fn?: () => Promise<any>): Promise<any> {
		this.send(message, fn && true);
		
		if (!fn) return;
		
		const result = await fn();
		
		this.send(message, false);
		
		return result;
	}
};
