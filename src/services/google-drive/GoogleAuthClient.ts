import { GoogleAuth, GoogleAuthOptions } from 'google-auth-library';
import credentials from '../../../auth/plexus.json';

export default class GoogleAuthClient {
	private static _client: GoogleAuth;
	
	public static async get(): Promise<GoogleAuth> {
		if (this._client) return this._client;
		
		const authOptions: GoogleAuthOptions = {
			credentials,
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
};
