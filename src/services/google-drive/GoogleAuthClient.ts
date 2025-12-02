import path from 'path';
import { GoogleAuth, GoogleAuthOptions } from 'google-auth-library';
import fs from 'fs';

export default class GoogleAuthClient {
	private static _client: GoogleAuth;
	
	public static async get(): Promise<GoogleAuth> {
		if (this._client) return this._client;
		
		const serviceAccountKeyPath = path.join(__dirname, '../../auth/mantra.json');
		
		const authOptions: GoogleAuthOptions = {
			scopes: [
				'https://www.googleapis.com/auth/drive',
				'https://www.googleapis.com/auth/spreadsheets',
				'https://www.googleapis.com/auth/documents',
				'https://www.googleapis.com/auth/cloud-platform'
			],
		};
		
		if (fs.existsSync(serviceAccountKeyPath)) authOptions.keyFile = serviceAccountKeyPath;
		
		return this._client = new GoogleAuth(authOptions);
	}
};
