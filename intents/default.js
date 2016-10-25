module.exports = function (intents, builder){
        intents.matches('None',[
        function(session,args,next){
            error_texts = [
                                    "Sorry, couldn't understand that :|",
                                    "Hmm not sure if I understdood that...can you rephrase your question?",
                                    "I didn't understand that :/",
                                    "Pardon me, but can you please rephrase?"
                                ]
            session.send(error_texts[Math.floor(Math.random() * error_texts.length)]);
        }
    ]);

intents.onDefault([
    function(session,args,next){
        error_texts = [
                                "Sorry, couldn't understand that :|",
                                "Hmm not sure if I understdood that...can you rephrase your question?",
                                "I didn't understand that :/",
                                "Pardon me, but can you please rephrase?"
                              ]
        session.send(error_texts[Math.floor(Math.random() * error_texts.length)]);
    }
]);
}