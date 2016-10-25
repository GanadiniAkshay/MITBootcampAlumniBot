module.exports = function (bot, builder, User){
    bot.dialog('/searchByName',[
        function (session){
            session.send("Searching by Name");
            session.endDialog();
        }
    ]);
}