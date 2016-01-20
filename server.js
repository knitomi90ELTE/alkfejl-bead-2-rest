var express = require('express');
var fortune = require('fortune');
var util = require('util');;
var nedbAdapter = require('fortune-nedb');
var jsonapi = require('fortune-json-api');
var bodyParser = require('body-parser');

var server = express();
server.use(bodyParser.json()); // for parsing application/json
server.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var store  = fortune({
    adapter: {
        type: nedbAdapter,
        options: { dbPath: __dirname + '/db' }
    },
    serializers: [{ type: jsonapi }]    
});

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

store.defineType('user',{
    mtra:       { type: String},
    surname :   { type: String},
    forename :  { type: String},
    subjects :  { link: 'subject', isArray: true}
    
});

store.defineType('subject',{
    subjectName:    { type: String },
    room :          { type: String },
    description :   { type: String },
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