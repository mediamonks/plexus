require('dotenv').config();

const functions = require('@google-cloud/functions-framework');

const router = require('./src/modules/router');

functions.http('api', async (req, res) => router(req, res));
