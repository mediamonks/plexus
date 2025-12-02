import { randomUUID } from 'node:crypto';
import { Firestore as FirestoreClient, Settings } from '@google-cloud/firestore';
import Config from '../../core/Config';

const { projectId, databaseId } = Config.get('firestore', { includeGlobal: true, includeRequest: false }) as Settings;

export default class Firestore {
	private static _client: FirestoreClient = new FirestoreClient({ projectId, databaseId, ignoreUndefinedProperties: true });
	
	public static async getDocument(collection: string, id: string | number): Promise<any> {
		const doc = await this.getDocRef(collection, id).get();
		return doc.data();
	}
	
	public static async setDocument(collection: string, id: string | number, data: any): Promise<any> {
		const docRef = this.getDocRef(collection, id);
		await docRef.set(data);
		return docRef;
	}
	
	public static async updateDocument(collection: string, id: string | number, data: any): Promise<any> {
		const docRef = this.getDocRef(collection, id);
		await docRef.set(data, { merge: true });
		return docRef;
	}
	
	public static async getCollection(collection: string): Promise<any> {
		return this._client.collection(collection).get();
	}
	
	public static async createDocument(collection: string, data: any): Promise<any> {
		return this.updateDocument(collection, randomUUID(), data);
	}
	
	private static getDocRef(collection: string, id: string | number): any {
		return this._client.collection(collection).doc(String(id));
	}
};
