var fortune = require('fortune');
var nedbAdapter = require('fortune-nedb');
var jsonapi = require('fortune-json-api');
    
var store  = fortune({
    adapter: {
        type: nedbAdapter,
        options: { dbPath: __dirname + '/db' }
    },
    serializers: [{ type: jsonapi }]    
});

store.defineType('user',{
    mtra:       { type: String },
    surname :   { type: String},
    forename :  { type: String},
    subjects :  { link: 'subject', inverse: 'user', isArray: true}
    
});

store.defineType('subject',{
    subjectName:    { type: String },
    room :          { type: String },
    description :   { type: String },
    status:         { type: Boolean },
    user :          { link: 'user', inverse: 'subjects' }
    
});

module.exports = store;