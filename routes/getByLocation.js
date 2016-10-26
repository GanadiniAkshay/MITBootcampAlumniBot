module.exports = function (bot, builder, User){
    bot.dialog('/searchByLocation',[
        function (session,args,next){
            if (session.userData.isBootcamper != 'true'){
                session.endDialog('Sorry I can provide this info only to alumni');
            }else{
                builder.Prompts.text(session,"Which country do you want to find bootcampers in?");
            }
        },
        function (session,results){
            session.send('Searching for bootcampers...')
            session.sendTyping();
            locations = results.response.split(' ');
            location = locations[locations.length-1].toLowerCase();
            User.find({"residence_country":location},function(err,campers){
            if (campers.length > 0){
                attachments = [];
                for (j=0;j<campers.length;j++){
                    attachments.push(
                        new builder.HeroCard(session)
                            .title(campers[j]['name'])
                            .subtitle(campers[j]["cohort"] + " Lives in " + campers[j]['residence_country'] + '. email : ' + campers[j]['email'])
                    )
                }
                var msg = new builder.Message(session).attachments(attachments);
                session.endDialog(msg);
            }
            else{
                session.endDialog("Sorry couldn't find anyone");
            }
        });
        }
    ]);
}