import { google, docs_v1 } from 'googleapis';
import TurndownService from 'turndown';
import GoogleAuthClient from './GoogleAuthClient';
import GoogleDrive from './GoogleDrive';
import CustomError from '../../entities/error-handling/CustomError';
import mime from 'mime-types';

export default class GoogleDocs {
	private static _client: docs_v1.Docs;
	
	public static async create(name: string, content: string, folderId?: string): Promise<string> {
		try {
			const client = await this.getClient();
			
			let documentId: string;
			if (folderId) {
				const { id } = await GoogleDrive.createFile(name, folderId, 'application/vnd.google-apps.document', content);
				documentId = id;
			} else {
				const response = await client.documents.create({ requestBody: { title: name } });
				documentId = response.data.documentId;
			}
			
			await client.documents.batchUpdate({
				documentId,
				requestBody: {
					requests: [{
						insertText: {
							location: { index: 1 },
							text: content,
						}
					}]
				}
			});
			
			return documentId;
		} catch (error) {
			throw new CustomError(`Failed to create document "${name}": ${error.message}`);
		}
	}
	
	public static async getText(documentId: string): Promise<string> {
		return GoogleDrive.export(documentId, mime.lookup('txt') as string);
	}
	
	public static async getMarkdown(documentId: string): Promise<string> {
		const turndownService = new TurndownService();
		
		const html = await GoogleDrive.export(documentId, mime.lookup('html') as string);
		
		return turndownService.turndown(html);
	}
	
	private static async getClient(): Promise<docs_v1.Docs> {
		if (this._client) return this._client;
		const auth = await GoogleAuthClient.get();
		return this._client = google.docs({ version: 'v1', auth });
	}
};
