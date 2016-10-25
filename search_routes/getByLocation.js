module.exports = function (bot){
    bot.dialog('/searchByLocation',[
        function (session,args,next){
            session.send("Searching by Location");
        }
    ]);
}