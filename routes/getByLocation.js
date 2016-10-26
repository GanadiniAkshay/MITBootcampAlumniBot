module.exports = function (bot, builder, User){
    bot.dialog('/searchByLocation',[
        function (session,args,next){
            builder.Prompts.text(session,"Which country do you want to find bootcampers in?");
        },
        function (session,results){
            session.send('Searching for bootcampers...')
            session.sendTyping();
            location = results.response.split(' ')[0].toLowerCase();
            session.send(Location);
            session.endDialog();
        }
    ]);
}