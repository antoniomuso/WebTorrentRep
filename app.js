var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');

var config = require("./config.json");
var users = require('./routes/torrent');

var app = express();



app.use('/torrent', users);


app.listen(config.port, function(){ console.log('Server listening...'); });