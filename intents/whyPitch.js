module.exports = function (intents,builder){
    intents.matches('whyPitch',[
    function (session){
        session.sendTyping();
        text = "A startup pitch or presentation helps us evaluate your level of interest & engagement in the problem you are trying to solve";
        session.send(text);
    }
]);
}