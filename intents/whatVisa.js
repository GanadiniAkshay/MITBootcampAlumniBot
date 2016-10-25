module.exports = function (intents,builder){
    intents.matches('whyPitch',[
    function (session){
        session.sendTyping();
        text = "We recommend that you to check with the US consulate in your country to check with type of visa you will need. The visa may depend on your situation. If your country has a visa waiver agreement with the United States, you may not need a visa to come to the bootcamp for one week as many of them permit you to stay for 30 days and sometimes even for 90 days depending on your nationality.";
        session.send(text);
        text1 = "We recommend you to get a tourist visa but if you are currently working or have your own business, the consulate may recommend that you apply for a B1/B2 temporary business visitor visa.";
        session.send(text1);
        text2 = "If you need a letter from MIT, we can provide admitted applicants with an invitation letter to come to the MIT Global Entrepreneurship Bootcamp if you email us your request at: mit15390@mit.edu.";
        session.send(text2);
        session.sendTyping();
        text3 = "However, MIT cannot issue a student visa for international students coming for just one week.";
        session.send(text3);
    }
]);
}