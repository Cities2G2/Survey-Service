var express = require('express');
var wagner = require('wagner-core');

require('./model/model')(wagner);

var app = express();

wagner.invoke(require('./auth'), { app: app });

app.use('/user', require('./routes/user')(wagner));

app.listen(3002);
console.log('TTPServer listening on port 3002!');