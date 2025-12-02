import History from '../core/History';
import { JsonArray } from '../types/common';

export default async ({ threadId }: { threadId: string }): Promise<JsonArray> => {
	const history = new History(threadId);
	
	await history.ready;
	
	return history.toJSON();
};
