require('dotenv').config();
process.env.PLEXUS_MODE = 'sdk';

module.exports = require('./dist/Plexus.js').default;
module.exports.Plexus = require('./dist/Plexus.js').default;
module.exports.Thread = require('./dist/Plexus.js').Thread;
