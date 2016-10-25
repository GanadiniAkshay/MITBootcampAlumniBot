module.exports = function(intents,builder){
    intents.matches(/^delete/i,[
    function (session){
        session.sendTyping();
        session.userData = {};
        session.send('Profile Reset');
    }
]);
}