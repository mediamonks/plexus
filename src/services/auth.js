const fs = require('node:fs');
const { google } = require('googleapis');

const CREDENTIALS_PATH = './auth/client-secret.json';
const TOKEN_PATH = './auth/token.json';

function authenticate() {
	const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH).toString()).web;
	const token = JSON.parse(fs.readFileSync(TOKEN_PATH).toString());
	
	const oauth2Client = new google.auth.OAuth2(
			credentials.client_id,
			credentials.client_secret
	);
	oauth2Client.setCredentials(token);
	
	return oauth2Client;
}

module.exports = authenticate;
