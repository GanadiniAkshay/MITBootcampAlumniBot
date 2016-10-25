module.exports = function (intents,builder){
    intents.matches('/name',[
        function (session){
            if (!session.privateConversationData.camper){
                session.send("Not sure who you are talking about");
            }else{
                session.send("His name is %s",session.privateConversationData.camper.name);
            }
        }
    ]);
}