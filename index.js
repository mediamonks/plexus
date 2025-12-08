const functions = require('@google-cloud/functions-framework');
const Router = require('./dist/core/Router.js').default;

require('dotenv').config();
process.env.PLEXUS_MODE = 'service';

functions.http('api', async (req, res) => Router.handle(req, res));
