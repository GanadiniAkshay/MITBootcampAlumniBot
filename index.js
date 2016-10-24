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
        if (!session.userData.firsName){
            session.userData.firsName = session.message.user.name.split(" ")[0];
        }
        hello_texts = ["Hi %s","Hey %s","Hello %s"]
        text = hello_texts[Math.floor(Math.random()*hello_texts.length)];
        session.send(text,session.userData.firsName);

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

intents.matches('whatIsBootcamp',[
    function (session){
        session.sendTyping();
        text = "The MIT Global Entrepreneurship Bootcamp is an intensive, week-long new ventures leadership program that gives bootcampers a taste of drinking from the firehose that all MIT students experience."
        text1 ="It is a nexus connecting entrepreneurs from around the world to the entrepreneurship and innovation eco-system surrounding the Massachusetts Institute of Technology";
        session.send(text);
        session.sendTyping();
        session.send(text1);
    }
]);

intents.matches('whatAlumni',[
    function (session){
        session.sendTyping();
        session.send("You can pass a custom message to Prompts.choice() that will present the user with a carousel of cards to select from. Each card can even support multiple actions.");
        
        // Ask the user to select an item from a carousel.
        var msg = new builder.Message(session)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments([
                new builder.HeroCard(session)
                    .title("Search by Name")
                    .subtitle("You can search the alumni by name")
                    .images([
                        builder.CardImage.create(session, "https://i.ytimg.com/vi/4EZ-fg1UIaQ/maxresdefault.jpg")
                    ])
                    .buttons([
                        builder.CardAction.imBack(session, "select:100", "Search by Name")
                    ]),
                new builder.HeroCard(session)
                    .title("Search by Skills")
                    .subtitle("You can search the alumni by skills")
                    .images([
                        builder.CardImage.create(session, "https://cdn.elegantthemes.com/blog/wp-content/uploads/2015/11/Essential-Skills-Top-10-shutterstock_285431867.png")
                    ])
                    .buttons([
                        builder.CardAction.imBack(session, "select:101", "Search by Skills")
                    ]),
                new builder.HeroCard(session)
                    .title("Search by Location")
                    .subtitle("You can search the alumni by location")
                    .images([
                        builder.CardImage.create(session, "http://i.huffpost.com/gen/1378629/images/o-LOCATION-MAP-facebook.jpg")
                    ])
                    .buttons([
                        builder.CardAction.imBack(session, "select:102", "Search by Location")
                    ]),
                new builder.HeroCard(session)
                    .title("Search by Language")
                    .subtitle("You can search the alumni by language they speak")
                    .images([
                        builder.CardImage.create(session, "http://rightbrainrevival.com/wp-content/uploads/2016/06/Learning-a-language-with-Zen.png")
                    ])
                    .buttons([
                        builder.CardAction.imBack(session, "select:103", "Search by Language")
                    ])
            ]);
        builder.Prompts.choice(session, msg, "select:100|select:101|select:102|select:103");
    },
    function (session, results) {
        var action, item;
        var kvPair = results.response.entity.split(':');
        switch (kvPair[0]) {
            case 'select':
                action = 'selected';
                break;
        }
        switch (kvPair[1]) {
            case '100':
                session.beginDialog('/searchByName');
                break;
            case '101':
                session.beginDialog('/searchBySkills');
                break;
            case '102':
                session.beginDialog('/searchByLocation');
                break;
            case '103':
                session.beginDialog('/searchByLanguage');
                break;
        }
        session.endDialog();
    }  
]);

intents.matches('positiveReply',[
    function (session){
        if (session.privateConversationData.questionAsked)
        {
            switch (session.privateConversationData.questionAsked){
                case 'isBootcamper':
                    session.privateConversationData.questionAsked = "";
                    if (!session.userData.isBootcamper){
                        session.beginDialog('/verifyEmail');
                    }
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
                    session.userData.isBootcamper = 'false';
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
        User.findOne({'email':email},function (err, user){
            if (err){
                console.log(err);
                session.send("Sorry, something went wrong. What can I help you with?");
            }

            if (user){
                otp = Math.floor(Math.random()*900000) + 100000;
                session.privateConversationData.otp = otp;
                client.sendEmail({
                    "From": "mail@akshaykulkarni.online", 
                    "To": email, 
                    "Subject": "MIT Bootcamp - One Time Password", 
                    "TextBody": "Your One Time Password is " + otp
                },function(error, success){
                    if(error) {
                        console.error("Unable to send via postmark: " + error.message);
                        return;
                    }
                    console.info("Sent to postmark for delivery")
                });
                builder.Prompts.text(session,"Please enter the one time password sent to your email");
            }
            else{
                session.send('Oops sorry :(');
                session.send("But I couldn't find your email in the list of bootcampers");
                session.send('Please fill this form to request access https://akshaykulkarni.typeform.com/to/RZq14y');
                session.send("You can still ask me general stuff about the bootcamp or disciplined entrepreneurship");
                session.endDialog();
            }
        });
    },
    function (session,results){
        otp = results.response;
        if (otp == session.privateConversationData.otp){
            session.privateConversationData.otp = "";
            session.userData.isBootcamper = 'true';
            session.send("You can ask me questions about the alumni or general stuff about bootcamp or disciplined entrepreneurship");
            session.endDialog();
        }else{
            builder.Prompts.text(session,"Sorry that's wrong, please enter the correct one time password");
        }
    },
    function(session, results){
        otp = results.response;
        if (otp == session.privateConversationData.otp){
            session.privateConversationData.otp = "";
            session.userData.isBootcamper = 'true';
            session.send("You can ask me questions about the alumni or general stuff about bootcamp or disciplined entrepreneurship");
        } else{
            session.send("Sorry, couldn't verify your email");
            session.send("You can still ask me general stuff about the bootcamp or disciplined entrepreneurship");
        }
        session.endDialog();
    }
]);



bot.dialog('/searchByName',[
    function (session,args,next){
        session.send("Searching by Name");
    }
]);

bot.dialog('/searchBySkills',[
    function (session,args,next){
        builder.Prompts.text("What skills are you looking for?");
    },
    function (session,results){
        session.send("Searching for bootcampers with those skills...");
        session.sendTyping();
        skills = session.response.split(' ');
        for (i=0;i<skills.length;i++){
            session.send("Searching for %s",skills[i]);
        }
    }
]);

bot.dialog('/searchByLanguage',[
    function (session,args,next){
        session.send("Searching by Language spoken");
    }
]);

bot.dialog('/searchByLocation',[
    function (session,args,next){
        session.send("Searching by Location");
    }
]);


