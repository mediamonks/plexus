const { GoogleAuth } = require('google-auth-library');

let client;

async function authenticate() {
	if (client) return client;
	
	const authClient = new GoogleAuth({
		scopes: ['https://www.googleapis.com/auth/drive'],
	});
	
	return client = await authClient.getClient();
}

module.exports = authenticate;
