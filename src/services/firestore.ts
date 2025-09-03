import { randomUUID } from 'node:crypto';
import { Firestore, Settings } from '@google-cloud/firestore';
import config from '../utils/config';

const firestoreConfig = config.get('firestore', true) as Settings;

const firestore = new Firestore(firestoreConfig);

function getDocRef(collection: string, id: string | number): any {
	return firestore.collection(collection).doc(String(id));
}

async function getDocument(collection: string, id: string | number): Promise<any> {
	const doc = await getDocRef(collection, id).get();
	return doc.data();
}

async function setDocument(collection: string, id: string | number, data: any): Promise<any> {
	const docRef = getDocRef(collection, id);
	await docRef.set(data);
	return docRef;
}

async function updateDocument(collection: string, id: string | number, data: any): Promise<any> {
	const docRef = getDocRef(collection, id);
	await docRef.set(data, { merge: true });
	return docRef;
}

async function getCollection(collection: string): Promise<any> {
	return firestore.collection(collection).get();
}

async function createDocument(collection: string, data: any): Promise<any> {
	return updateDocument(collection, randomUUID(), data);
}

export default {
	getDocument,
	setDocument,
	updateDocument,
	getCollection,
	createDocument,
};
