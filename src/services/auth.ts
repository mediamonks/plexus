import { GoogleAuth, GoogleAuthOptions } from 'google-auth-library';
import path from 'path';
import fs from 'fs';

declare const __dirname: string;

let client;

export default async function authenticate(): Promise<any> {
	if (client) return client;
	
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
	
	const authClient = new GoogleAuth(authOptions);
	
	return client = await authClient.getClient();
}
