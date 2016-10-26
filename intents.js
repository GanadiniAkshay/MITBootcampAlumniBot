module.exports = function (intents,builder){
    require('./intents/delete.js')(intents,builder);
    require('./intents/hello.js')(intents,builder);
    require('./intents/whatIsBootcamp.js')(intents,builder);
    require('./intents/whatAlumni.js')(intents,builder);
    require('./intents/positiveReply.js')(intents,builder);
    require('./intents/negativeReply.js')(intents,builder);
    require('./intents/default.js')(intents,builder);
    require('./intents/whatInResume.js')(intents,builder);
    require('./intents/whyPitch.js')(intents,builder);
    require('./intents/whatVisa.js')(intents,builder);
    require('./intents/getByLocation.js')(intents,builder);
    require('./intents/whatSkill.js')(intents,builder);
    require('./intents/conversation.js')(intents,builder);
}