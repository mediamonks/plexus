import { randomUUID } from 'node:crypto';
import { DocumentReference, Firestore as FirestoreClient, QuerySnapshot, Settings } from '@google-cloud/firestore';
import Config from '../../core/Config';
import { JsonObject } from '../../types/common';

export default class Firestore {
	private static _client: FirestoreClient;
	
	private static get client(): FirestoreClient {
		if (this._client) return this._client;
		
		const { projectId, databaseId } = Config.get('firestore', { includeGlobal: true }) as Settings;
		
		return this._client = new FirestoreClient({ projectId, databaseId, ignoreUndefinedProperties: true });
	}
	
	public static async getDocument(collection: string, id: string | number): Promise<JsonObject | undefined> {
		const doc = await this.getDocRef(collection, id).get();
		return doc.data() as JsonObject | undefined;
	}
	
	public static async setDocument(collection: string, id: string | number, data: JsonObject): Promise<DocumentReference> {
		const docRef = this.getDocRef(collection, id);
		await docRef.set(data);
		return docRef;
	}
	
	public static async updateDocument(collection: string, id: string | number, data: JsonObject): Promise<DocumentReference> {
		const docRef = this.getDocRef(collection, id);
		await docRef.set(data, { merge: true });
		return docRef;
	}
	
	public static async getCollection(collection: string): Promise<QuerySnapshot> {
		return this.client.collection(collection).get();
	}
	
	public static async createDocument(collection: string, data: any): Promise<DocumentReference> {
		return this.updateDocument(collection, randomUUID(), data);
	}
	
	private static getDocRef(collection: string, id: string | number): DocumentReference {
		return this.client.collection(collection).doc(String(id));
	}
};
