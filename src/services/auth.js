const { GoogleAuth } = require('google-auth-library');
const path = require('path');
const fs = require('fs');

let client;

async function authenticate() {
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

module.exports = authenticate;
