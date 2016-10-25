var builder = require('botbuilder');
module.exports = {

    //Create Chat Bot
    var connector = new builder.ChatConnector({
        appId: process.env.MICROSOFT_APP_ID,
        appPassword: process.env.MICROSOFT_APP_PASSWORD
    });

    var bot = new builder.UniversalBot(connector);
    bot.dialog('/searchByLanguage',[
        function (session,args,next){
            session.send("Searching by Language spoken");
        }
    ]);
}