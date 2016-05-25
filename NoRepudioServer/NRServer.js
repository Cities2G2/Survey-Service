var express = require('express');
var wagner = require('wagner-core');
var cors = require('cors');

require('./model/model')(wagner);

var app = express();

app.use(cors());

app.use('/NR', require('./routes/messageNR')(wagner));

app.listen(3004);
console.log('NRServer listening on port 3004!');