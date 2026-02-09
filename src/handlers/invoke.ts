import Plexus from '../Plexus';
import { JsonObject, InvokePayload } from '../types/common';

export default async (_: void, { config, threadId, fields }: InvokePayload): Promise<JsonObject> => {
	return new Plexus(config).thread(threadId).invoke(fields);
};
