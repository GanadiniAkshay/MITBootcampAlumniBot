module.exports = function (intents, builder){
    intents.matches('negativeReply',[
    function (session){
        if (session.privateConversationData.questionAsked)
        {
            switch (session.privateConversationData.questionAsked){
                case 'isBootcamper':
                    session.privateConversationData.questionAsked = "";
                    session.userData.isBootcamper = 'false';
                    session.send("That's okay");
                    session.send("Btw I can answer any questions you have about the bootcamp");
                    break;
                default:
                    session.send("Sorry, something went wrong. What can I help you with?");
                    break;
            }

        }else{
            session.send("Sorry, something went wrong. What can I help you with?");
        }
    }
]);
}