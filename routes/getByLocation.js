module.exports = function (bot, builder, User){
    bot.dialog('/searchByLocation',[
        function (session,args,next){
            builder.Prompts.text(session,"Which country do you want to find bootcampers in?");
        },
        function (session,results){
            session.send('Searching for bootcampers...')
            session.sendTyping();
            locations = results.response.split(' ');
            location = locations[locations.length-1].toLowerCase();
            session.send(location);
            session.endDialog();
        }
    ]);
}