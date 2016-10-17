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

intents.matches(/^delete/i,[
    function (session){
        session.sendTyping();
        session.userData = {};
        session.send('Profile Reset');
    }
]);

intents.matches('hello',[
    function (session,args,next){
        session.sendTyping();
        hello_texts = ["Hi %s","Hey %s","Hello %s"]
        text = hello_texts[Math.floor(Math.random()*hello_texts.length)];
        session.send(text,session.message.user.name);

         if (!session.userData.isBootcamper){
            session.sendTyping();
            session.privateConversationData.questionAsked = 'isBootcamper';
            var replyMessage = new builder.Message(session)
                                            .text('So have you attended the MIT bootcamp prevously?');

                    replyMessage.sourceEvent({ 
                            facebook: { 
                                quick_replies: [{
                                    content_type:"text",
                                    title:"Yes I have",
                                    payload:"yes"
                                },            
                                {
                                    content_type:"text",
                                    title:"Nope I haven't",
                                    payload:"no"
                                }]
                            }
                        });
            session.send(replyMessage);
        }
    }
]);

intents.matches('positiveReply',[
    function (session){
        if (session.privateConversationData.questionAsked)
        {
            switch (session.privateConversationData.questionAsked){
                case 'isBootcamper':
                    session.privateConversationData.questionAsked = "";
                    session.beginDialog('/verifyEmail');
                    break;
                default:
                    session.send("Sorry, something went wrong. What can I help you with?");
                    break;
            }

        }else{
            session.send("Sorry, something went wrong. What can I help you with?");
        }
    }
]);


intents.matches('negativeReply',[
    function (session){
        if (session.privateConversationData.questionAsked)
        {
            switch (session.privateConversationData.questionAsked){
                case 'isBootcamper':
                    session.privateConversationData.questionAsked = "";
                    session.send("That's okay I can answer questions about the bootcamp or disciplined entrepreneurship");
                    break;
                default:
                    session.send("Sorry, something went wrong. What can I help you with?");
                    break;
            }

        }else{
            session.send("Sorry, something went wrong. What can I help you with?");
        }
    }
]);

intents.matches('None',[
    function(session,args,next){
        error_texts = [
                                "Sorry, couldn't understand that :|",
                                "Hmm not sure if I understdood that...can you rephrase your question?",
                                "I didn't understand that :/",
                                "Pardon me, but can you please rephrase?"
                              ]
        session.send(error_texts[Math.floor(Math.random() * error_texts.length)]);
    }
]);

intents.onDefault([
    function(session,args,next){
        error_texts = [
                                "Sorry, couldn't understand that :|",
                                "Hmm not sure if I understdood that...can you rephrase your question?",
                                "I didn't understand that :/",
                                "Pardon me, but can you please rephrase?"
                              ]
        session.send(error_texts[Math.floor(Math.random() * error_texts.length)]);
    }
]);


//=====================================================
// Supporting Bot Dialogs
//=====================================================


bot.dialog('/verifyEmail',[
    function(session){
        builder.Prompts.text(session,"What's your email?");
    },
    function (session,results){
        email = results.response;
        otp = Math.floor(Math.random()*900000) + 100000;
        client.sendEmail({
            "From": "mail@akshaykulkarni.online", 
            "To": email, 
            "Subject": "Test", 
            "TextBody": "Your One Time Password is " + otp
        },function(error, success){
            if(error) {
                console.error("Unable to send via postmark: " + error.message);
                return;
            }
            console.info("Sent to postmark for delivery")
        });
        builder.Prompts.text("Please enter the one time password sent to your email");
    },
    function (session,results){
        session.endDialog();
    }
]);



