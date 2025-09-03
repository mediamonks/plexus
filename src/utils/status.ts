import config from './config';
import { Configuration } from '../types/common';

function send(message: string, isRunning?: boolean): void {
	const postback = config.get('postback') as Configuration['postback'];
	if (!postback?.url) return;
	
	fetch(postback.url, {
		method: 'POST',
		headers: postback.headers,
		body: JSON.stringify({ message, isRunning }),
	}).catch(() => undefined);
}

async function wrap(message: string, fn?: () => Promise<any>): Promise<any> {
	send(message, fn && true);
	
	if (!fn) return;
	
	const result = await fn();
	
	send(message, false);
	
	return result;
}

export default { send, wrap };
