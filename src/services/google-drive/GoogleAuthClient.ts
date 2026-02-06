import fs from 'node:fs/promises';
import path from 'node:path';
import { GoogleAuth, GoogleAuthOptions } from 'google-auth-library';
import { JWTInput } from 'google-auth-library/build/src/auth/credentials';
import Config from '../../core/Config';

const SCOPES = [
	'https://www.googleapis.com/auth/drive',
	'https://www.googleapis.com/auth/spreadsheets',
	'https://www.googleapis.com/auth/documents',
	'https://www.googleapis.com/auth/cloud-platform',
	'https://www.googleapis.com/auth/sqlservice.login'
];

export default class GoogleAuthClient {
	private static _client: GoogleAuth;
	
	public static async get(): Promise<GoogleAuth> {
		if (this._client) return this._client;
		
		const credentials = await this.getCredentials();
		
		const authOptions: GoogleAuthOptions = {
			credentials,
			projectId: Config.get('projectId'),
			scopes: SCOPES,
		};
		
		return this._client = new GoogleAuth(authOptions);
	}
	
	public static async getCredentials(): Promise<JWTInput> {
		if (process.env.SERVICE_ACCOUNT_KEY) {
			return JSON.parse(process.env.SERVICE_ACCOUNT_KEY);
		}
		
		try {
			const fallbackPath = path.resolve(process.cwd(), 'auth', 'credentials.json');
			const json = await fs.readFile(fallbackPath, 'utf8');
			return JSON.parse(json);
		} catch {
			return undefined;
		}
	}
};
