var builder = require('botbuilder');
var restify = require('restify');
var mongoose = require('mongoose');

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


//=====================================================
// Bots Dialogs
//=====================================================

var intents = new builder.IntentDialog();
bot.dialog('/',intents);

intents.matches(/^delete/i,[
    function (session){
        session.sendTyping();
        session.userData = {};
        session.send('Profile Reset');
    }
]);

intents.onDefault([
    function (session,args,next)
    {
        if (!session.userData.firstName){
            session.beginDialog('/ensureName');
        }else{
            next();
        }
    },
    function (session,args,next){
        session.send('Hi, %s',session.userData.firstName);
        next();
    },
    function (session,args,next){
        if (!session.userData.email){
            session.beginDialog('/ensureEmail');
        } else{
            next();
        }
    },
    function (session){
        session.send(session.message.text);
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

bot.dialog('/ensureEmail',[
    function(session){
        builder.Prompts.text(session, "What's your email id?");
    },
    function (session,results){
        session.sendTyping();
        session.userData.email = results.response;
        User.findOne({'email':session.userData.email},function (err, user){
            if (err)
                return done(err);
            if (user)
            {
                session.send('I see that you are from %s', user.cohort);
                session.endDialog();
            }
            else
            {
                var replyMessage = new builder.Message(session)
                                            .text("Testing");

                    replyMessage.sourceEvent({ 
                            facebook: { 
                                quick_replies: [{
                                    content_type:"text",
                                    title:"Red",
                                    payload:"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED",
                                    image_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Button_Icon_Red.svg/300px-Button_Icon_Red.svg.png"
                                },            
                                {
                                    content_type:"text",
                                    title:"Blue",
                                    payload:"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_BLUE",
                                    image_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Button_Icon_Blue.svg/768px-Button_Icon_Blue.svg.png"
                                },
                                {
                                    content_type:"location"
                                }]
                            }
                        });
                    session.send(replyMessage);
                    session.endDialog();
            }
        });
    }
]);
