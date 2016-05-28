var express = require('express');
var wagner = require('wagner-core');
var cors = require('cors');

require('./model/model')(wagner);

var app = express();

app.use(cors());

app.use('/survey', require('./routes/survey')(wagner));
app.use('/resolvedsurvey', require('./routes/resolvedSurvey')(wagner));

app.use(express.static('www'));

app.get('/', function(req, res) {
    res.sendfile('./www/index.html');
});

app.listen(3000);
console.log('SurveyServer listening on port 3000!');