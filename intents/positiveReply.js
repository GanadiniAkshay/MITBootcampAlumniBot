module.exports = function (intents,builder){
    intents.matches('positiveReply',[
    function (session){
        if (session.privateConversationData.questionAsked)
        {
            switch (session.privateConversationData.questionAsked){
                case 'isBootcamper':
                    session.privateConversationData.questionAsked = "";
                    if (!session.userData.isBootcamper){
                        session.beginDialog('/verifyEmail');
                    }
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