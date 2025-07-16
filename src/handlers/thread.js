module.exports = async ({ threadId }) => require('../services/firestore').getDocument('threads', threadId);
