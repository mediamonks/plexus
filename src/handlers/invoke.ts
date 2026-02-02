import Plexus from '../Plexus';
import { JsonObject, InvokePayload } from '../types/common';

export default async (_: void, { threadId, fields }: InvokePayload): Promise<{
	output: JsonObject;
	threadId: string;
	fields: JsonObject;
}> => {
	return Plexus.instance.thread(threadId).invoke(fields);
};
