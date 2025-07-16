(async function () {
	const fs = require('node:fs');
	const express = require('express');
	const { default: open } = await import('open');
	const { google } = require('googleapis');
	
	const CREDENTIALS_PATH = './auth/client-secret.json';
	const TOKEN_PATH = './auth/token.json';
	const SCOPES = [
		'https://www.googleapis.com/auth/drive',
	];
	
	async function authenticate() {
		const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH).toString()).web;
		const oauth2Client = new google.auth.OAuth2(
				credentials.client_id,
				credentials.client_secret,
				'http://localhost:3000'
		);
		
		const authUrl = oauth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });
		console.log('Opening browser for authentication:', authUrl);
		open(authUrl).then();
		
		const app = express();
		app.get('/', async (req, res) => {
			const code = req.query.code;
			if (!code) {
				res.send('No code provided');
				return;
			}
			
			const { tokens } = await oauth2Client.getToken(code);
			oauth2Client.setCredentials(tokens);
			fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
			
			console.log('Token saved to', TOKEN_PATH);
			res.send('Authentication successful! You can close this tab.');
			process.exit();
		});
		
		app.listen(3000, () => console.log('Waiting for authentication...'));
	}
	
	authenticate().then();
}());
