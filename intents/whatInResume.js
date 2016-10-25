module.exports = function (intents,builder){
    intents.matches('whatInResume',[
    function (session){
        session.sendTyping();
        text = "Highlight specific achievments that are significant accomplishments in your career and life on your resume";
        session.send(text);
    }
]);
}