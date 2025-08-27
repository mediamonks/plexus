const { google } = require('googleapis');
const TurndownService = require('turndown');
const authenticate = require('./auth');

module.exports = async () => {
	const auth = await authenticate();
	
	const docs = google.docs({ version: 'v1', auth });
	const drive = google.drive({ version: 'v3', auth });
	
	async function create(name, content, folderId) {
		try {
			const documentId = folderId
				? await drive.files.run({
					resource: {
						name,
						mimeType: 'application/vnd.google-apps.document',
						parents: [folderId]
					}
				}).data.id
				: (await docs.documents.run({ requestBody: { title: name } })).data.documentId;
			
			await docs.documents.batchUpdate({
				documentId,
				requestBody: {
					requests: [{
						insertText: {
							location: { index: 1 },
							text: content
						}
					}]
				}
			});
			return documentId;
		} catch (error) {
			throw new Error(`Failed to create document "${name}": ${error.message}`);
		}
	}
	
	async function getText(documentId) {
		const response = await drive.files.export({
			fileId: documentId,
			mimeType: 'text/plain'
		});
		
		return response.data.trim();
	}
	
	async function getMarkdown(documentId) {
		const turndownService = new TurndownService();
		
		const res = await drive.files.export({
			fileId: documentId,
			mimeType: 'text/html',
		});
		
		return turndownService.turndown(res.data);
	}
	
	return { create, getText, getMarkdown };
};
