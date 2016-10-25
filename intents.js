module.exports = function (intents,builder){
    require('./intents/delete.js')(intents,builder);
    require('./intents/hello.js')(intents,builder);
    require('./intents/whatIsBootcamp.js')(intents,builder);
    require('./intents/whatAlumni.js')(intents,builder);
    require('./intents/positiveReply.js')(intents,builder);
    require('./intents/negativeReply.js')(intents,builder);
    require('./intents/default.js')(intents,builder);
}