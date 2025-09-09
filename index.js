const functions = require('@google-cloud/functions-framework');
const router = require('./dist/modules/router.js').default;

require('dotenv').config();

functions.http('api', async (req, res) => router(req, res));
