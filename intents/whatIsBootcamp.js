module.exports = function (intents, builder){
    intents.matches('whatIsBootcamp',[
    function (session){
        session.sendTyping();
        text = "The MIT Global Entrepreneurship Bootcamp is an intensive, week-long new ventures leadership program that gives bootcampers a taste of drinking from the firehose that all MIT students experience."
        text1 ="It is a nexus connecting entrepreneurs from around the world to the entrepreneurship and innovation eco-system surrounding the Massachusetts Institute of Technology";
        session.send(text);
        session.sendTyping();
        session.send(text1);
    }
]);
}