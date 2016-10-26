module.exports = function (intents, builder){

    intents.matches('smileback',[
        function (session){
            session.send(':)');
        }
    ]);

    intents.matches('goodmorning',[
        function (session){
            session.send('good morning');
        }
    ]);

    intents.matches('goodafternoon',[
        function (session){
            session.send('good afternoon');
        }
    ]);

    intents.matches('goodevening',[
        function (session){
            session.send('good evening');
        }
    ]);

    intents.matches('goodnight',[
        function (session){
            session.send('good night');
        }
    ]);

    intents.matches('sup',[
        function (session){
            session.send('Nothing much, just adminring the amazing skillset of bootcampers ;)');
        }
    ]);

    intents.matches('bye',[
        function (session){
            session.send('goodbye! It was nice talking to you');
        }
    ]);

}