import firestore from '../services/firestore';

export default async ({ threadId }: { threadId: string }): Promise<any> => firestore.getDocument('threads', threadId);
