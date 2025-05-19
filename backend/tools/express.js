require('dotenv').config();

const app = require('express')();
app.listen(81);
app.post('/api', require('../src/modules/router'));
