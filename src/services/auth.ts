import { GoogleAuth } from 'google-auth-library';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let client;

export default async function authenticate(): Promise<any> {
	if (client) return client;
	
	const serviceAccountKeyPath = path.join(__dirname, '../../auth/mantra.json');
	
	let authOptions = {
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

