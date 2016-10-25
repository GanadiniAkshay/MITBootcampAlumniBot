module.exports = {
    bot.dialog('/searchByLanguage',[
        function (session,args,next){
            session.send("Searching by Language spoken");
        }
    ]);
}