var express = require('express');
var store = require('./store');
var fortune = require('fortune');
//var bodyParser = require('body-parser');
var util = require('util');

var server = express();
//server.use(bodyParser.json()); // for parsing application/json
//server.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

function debug(title, data){
    console.log(title + ": " + util.inspect(data, false, null));
}

// Express middleware
server.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

server.use(fortune.net.http(store));

// Csak akkor fusson a szerver, ha sikerült csatlakozni a tárolóhoz
// Hasonlóan a Waterline-hoz  
var port = process.env.PORT || 8080;
store.connect().then(function () {
    server.listen(port, function () {
        console.log('JSON Api server started on port ' + port);
    });
});