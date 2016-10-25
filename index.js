var builder = require('botbuilder');
var restify = require('restify');
var mongoose = require('mongoose');

var postmark = require('postmark');

require('dotenv').config({silent: true})



//=============================================
// Postmark email server Setup
//=============================================
var client = new postmark.Client(process.env.SERVER_KEY);


//==============================================
// Database Setup
//==============================================
mongoose.connect(process.env.MONGO_URL);


//===============================================
// Database Models Setup
//===============================================
var User = require('./models/user');

//==============================================
// Bot Setup
//==============================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.PORT || process.env.port || 3978, function(){
    console.log('%s is listening to %s',server.name, server.url);
});

//Create Chat Bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var bot = new builder.UniversalBot(connector);
server.post('/api/messages',connector.listen());


//====================================================
// Setup LUIS
//====================================================
var model = "https://api.projectoxford.ai/luis/v1/application?id=46838f95-fb66-4c10-bb00-8b54fbbf82db&subscription-key=f44e86844076443285013c85ea3f9b3e&q=";
var recognizer = new builder.LuisRecognizer(model);
var intents = new builder.IntentDialog({recognizers:[recognizer]});

//=====================================================
// Bots Dialogs
//=====================================================

bot.dialog('/',intents);


require('./intents/delete.js')(intents,builder);
require('./intents/hello.js')(intents,builder);
require('./intents/whatisBootcamp.js')(intents,builder);
require('./intents/whatAlumni.js')(intents,builder);
require('./intents/positiveReply.js')(intents,builder);
require('./intents/negativeReply.js')(intents,builder);
require('./intents/default.js')(intents,builder);


//=====================================================
// Supporting Bot Dialogs
//=====================================================
require('./routes/verifyEmail.js')(bot,builder,User);
require('./routes/getByName.js')(bot,builder,User);
require('./routes/getBySkills.js')(bot,builder,User);
require('./routes/getByLocation.js')(bot,builder,User);
require('./routes/getByLanguage.js')(bot,builder,User);






