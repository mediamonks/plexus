const firestore = require('../services/firestore');

module.exports = async function generateCopy({ threadId }) {
	return firestore.getDocument('threads', threadId);
};
