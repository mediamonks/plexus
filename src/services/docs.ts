import { google } from 'googleapis';
import TurndownService from 'turndown';
import authenticate from './auth';
import CustomError from '../entities/error-handling/CustomError';

export default async (): Promise<{
	create: (name: string, content: string, folderId?: string) => Promise<string>;
	getText: (documentId: string) => Promise<string>;
	getMarkdown: (documentId: string) => Promise<string>;
}> => {
	const auth = await authenticate();
	
	const docs = google.docs({ version: 'v1', auth });
	const drive = google.drive({ version: 'v3', auth });
	
	async function create(name: string, content: string, folderId?: string): Promise<string> {
		try {
			let documentId;
			if (folderId) {
				const response = await drive.files.create({
					requestBody: {
						name,
						mimeType: 'application/vnd.google-apps.document',
						parents: [folderId]
					}
				});
				documentId = response.data.id;
			} else {
				const response = await docs.documents.create({ requestBody: { title: name } });
				documentId = response.data.documentId;
			}
			
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
			throw new CustomError(`Failed to create document "${name}": ${error.message}`);
		}
	}
	
	async function getText(documentId: string): Promise<string> {
		const response = await drive.files.export({
			fileId: documentId,
			mimeType: 'text/plain'
		});
		
		return (response.data as string).trim();
	}
	
	async function getMarkdown(documentId: string): Promise<string> {
		const turndownService = new TurndownService();
		
		const res = await drive.files.export({
			fileId: documentId,
			mimeType: 'text/html',
		});
		
		return turndownService.turndown(res.data);
	}
	
	return { create, getText, getMarkdown };
};
