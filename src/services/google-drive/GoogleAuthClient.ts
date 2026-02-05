import fs from 'node:fs/promises';
import path from 'node:path';
import { GoogleAuth, GoogleAuthOptions, Impersonated } from 'google-auth-library';
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
		const impersonateServiceAccount = process.env.GOOGLE_IMPERSONATE_SERVICE_ACCOUNT;
		
		const authOptions: GoogleAuthOptions = {
			credentials,
			projectId: Config.get('projectId'),
			scopes: SCOPES,
		};
		
		const auth = new GoogleAuth(authOptions);
		
		if (impersonateServiceAccount && !credentials) {
			const sourceClient = await auth.getClient();
			const impersonatedClient = new Impersonated({
				sourceClient,
				targetPrincipal: impersonateServiceAccount,
				targetScopes: SCOPES,
				lifetime: 3600,
			});
			
			this._client = new GoogleAuth({ authClient: impersonatedClient });
		} else {
			this._client = auth;
		}
		
		return this._client;
	}
	
	private static async getCredentials(): Promise<JWTInput> {
		const { GOOGLE_APPLICATION_CREDENTIALS } = process.env;
		if (GOOGLE_APPLICATION_CREDENTIALS) return JSON.parse(GOOGLE_APPLICATION_CREDENTIALS.trim());
		
		try {
			const fallbackPath = path.resolve(process.cwd(), 'auth', 'plexus.json');
			const json = await fs.readFile(fallbackPath, 'utf8');
			return JSON.parse(json);
		} catch {
			return undefined;
		}
	}
};
