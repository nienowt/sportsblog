'use strict';

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/db');

var port = process.env.PORT || 3000;

app.use(bodyParser.json());

let router = express.Router();
require(__dirname + '/routes/userRoutes')(router);
require(__dirname + '/routes/blogroutes')(router);
require(__dirname + '/routes/loginRoutes')(router);
require(__dirname + '/routes/weather-routes')(router);
<<<<<<< HEAD
require(__dirname + '/routes/nfl-routes')(router);
require(__dirname + '/routes/mlb-routes')(router);
=======
require(__dirname + '/routes/nba-routes')(router);
>>>>>>> 92f91c777bb7e45be13ca00f11406204d201d411
app.use('/', router);

app.listen(port, function() {
  console.log('Server listening on port ' + (port || 3000));
});
