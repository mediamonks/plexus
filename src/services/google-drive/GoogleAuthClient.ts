import { GoogleAuth, GoogleAuthOptions } from 'google-auth-library';
import { JWTInput } from 'google-auth-library/build/src/auth/credentials';

export default class GoogleAuthClient {
	private static _client: GoogleAuth;
	
	public static async get(): Promise<GoogleAuth> {
		if (this._client) return this._client;
		
		const authOptions: GoogleAuthOptions = {
			credentials: await this.getCredentials(),
			projectId: 'monks-plexus',
			scopes: [
				'https://www.googleapis.com/auth/drive',
				'https://www.googleapis.com/auth/spreadsheets',
				'https://www.googleapis.com/auth/documents',
				'https://www.googleapis.com/auth/cloud-platform',
				'https://www.googleapis.com/auth/sqlservice.login'
			],
		};
		
		return this._client = new GoogleAuth(authOptions);
	}
	
	private static async getCredentials(): Promise<JWTInput> {
		const { GOOGLE_APPLICATION_CREDENTIALS } = process.env;
		
		if (GOOGLE_APPLICATION_CREDENTIALS) return JSON.parse(GOOGLE_APPLICATION_CREDENTIALS);
		
		return await import('../../../auth/plexus.json');
	}
};
