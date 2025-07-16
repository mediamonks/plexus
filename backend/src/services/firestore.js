const { randomUUID } = require('node:crypto');
const { Firestore } = require('@google-cloud/firestore');
const config = require('../utils/config');
// const firestoreConfig = { projectId: config.get('projectId'), ...require('../../config/firestore.json') };
const firestoreConfig = config.get('firestore');

const firestore = new Firestore(firestoreConfig);

function getDocRef(collection, id) {
	return firestore.collection(collection).doc(String(id));
}

async function getDocument(collection, id) {
	const doc = await getDocRef(collection, id).get();
	return doc.data();
}

async function setDocument(collection, id, data) {
	const docRef = getDocRef(collection, id);
	await docRef.set(data);
	return docRef;
}

async function updateDocument(collection, id, data) {
	const docRef = getDocRef(collection, id);
	await docRef.set(data, { merge: true });
	return docRef;
}

async function getCollection(collection) {
	return firestore.collection(collection).get();
}

async function createDocument(collection, data) {
	return updateDocument(collection, randomUUID(), data);
}

module.exports = {
	getDocument,
	setDocument,
	updateDocument,
	getCollection,
	createDocument,
};
