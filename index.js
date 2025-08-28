import 'dotenv/config';
import functions from '@google-cloud/functions-framework';
import router from './src/modules/router.js';

functions.http('api', async (req, res) => router(req, res));
