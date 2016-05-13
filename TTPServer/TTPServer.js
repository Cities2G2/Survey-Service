var express = require('express');
var wagner = require('wagner-core');
var cors = require('cors');

require('./model/model')(wagner);

var app = express();

app.use(cors());

//app.options(cors({origin:'http://localhost:3000'}));
//app.use(cors({origin: 'http://localhost:3000'}));

wagner.invoke(require('./auth'), { app: app });

app.use('/user', require('./routes/user')(wagner));

app.listen(3002);
console.log('TTPServer listening on port 3002!');