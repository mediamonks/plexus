require('dotenv').config();
process.env.PLEXUS_MODE = 'service';

const functions = require('@google-cloud/functions-framework');
const Router = require('./dist/core/Router.js').default;

functions.http('api', async (req, res) => Router.handle(req, res));
