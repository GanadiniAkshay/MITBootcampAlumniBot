module.exports = function (intents, builder){
    intents.matches('hello',[
    function (session,args,next){
        session.sendTyping();
        if (!session.userData.firsName){
            session.userData.firsName = session.message.user.name.split(" ")[0];
        }
        hello_texts = ["Hi %s","Hey %s","Hello %s"]
        text = hello_texts[Math.floor(Math.random()*hello_texts.length)];
        session.send(text,session.userData.firsName);

         if (!session.userData.isBootcamper){
            session.sendTyping();
            session.privateConversationData.questionAsked = 'isBootcamper';
            var replyMessage = new builder.Message(session)
                                            .text('So have you attended the MIT bootcamp prevously?');

                    replyMessage.sourceEvent({ 
                            facebook: { 
                                quick_replies: [{
                                    content_type:"text",
                                    title:"Yes I have",
                                    payload:"yes"
                                },            
                                {
                                    content_type:"text",
                                    title:"Nope I haven't",
                                    payload:"no"
                                }]
                            }
                        });
            session.send(replyMessage);
        }
    }
]);
}