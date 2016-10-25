module.exports = function (bot, builder, User){
    bot.dialog('/searchByLanguage',[
        function (session,args,next){
            session.send("Searching by Language spoken");
            session.endDialog();
        }
    ]);
}