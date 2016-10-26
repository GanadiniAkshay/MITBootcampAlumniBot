module.exports = function (intents,builder){
    intents.matches('whatSkill',[
        function (session,args,next){
            if (session.userData.isBootcamper != 'true'){
                session.endDialog('You can ask general questions about the bootcamp');
            }else{
                sesion.send("Searching for bootcampers");
            }
        }
    ])
}