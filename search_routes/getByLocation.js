module.exports = function (bot, builder, User){
    bot.dialog('/searchByLocation',[
        function (session,args,next){
            session.send("Searching by Location");
            session.endDialog();
        }
    ]);
}