module.exports = function (bot){
    bot.dialog('/searchByName',[
        function (session){
            session.send("Searching by Name");
            session.endDialog();
        }
    ]);
}