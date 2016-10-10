var builder = require('botbuilder');
var restify = require('restify');
var http    = require('http');
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


//=====================================================
// Bots Dialogs
//=====================================================

var intents = new builder.IntentDialog();
bot.dialog('/',intents);

intents.matches(/^facebook/i,[
    function (session,next)
    {
        if (!session.userData.firstName){
            session.beginDialog('/ensureName');
        }else{
            next();
        }
    }
]);

intents.onDefault([
    function (session){
        session.send('Hi, user');
    }
]);



bot.dialog('/ensureName',[
    function(session){
        name = session.message.user.name.split(" ");
        session.userData.firstName = name[0];
        session.userData.lastName  = name[1];
        session.endDialog();
    }
]);
