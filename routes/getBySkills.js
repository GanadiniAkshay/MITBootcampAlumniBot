module.exports = function (bot, builder, User){
    bot.dialog('/searchBySkills',[
        function (session){
            builder.Prompts.text(session,"What skills are you looking for?");
        },
        function (session,results,next){
            session.send('Searching for bootcampers with those skills....')
            session.sendTyping();
            unneccessary = ['someone','somebody','who','is','the','an','a','and','&','like','maybe','in','good','at','better','best','person','man','woman','boy','girl','can'];
            profession_map = {
                "programmer" : 'programming',
                "programs"   : 'programming',
                "developer"  : 'programming',
                "develops"   : 'programming',
                "code"       : 'programming',
                "coding"     : 'programming',
                "coder"      : 'programming',
                "codes"      : 'programming',
                "paints"     : 'painting',
                "painter"    : 'painting',
                "photographer" : 'photography',
                "videographer" : 'videography',
                "seller"       : 'selling',
                "teacher"      : 'teaching'
            };
            skills = results.response.split(' ');
            for(i=0;i<skills.length;i++) {
                if (unneccessary.indexOf(skills[i]) == -1) {
                    var search_skill = "";
                    if (skills[i] in profession_map){
                        search_skill = [profession_map[skills[i]]]
                    } else{
                        search_skill = [skills[i]];
                    }
                    User.find({"skills":{ $in : search_skill}},function(err,campers){
                        session.privateConversationData.bootcampers = campers;
                        attachments = [];
                        choices = "";
                        for (j=0;j<campers.length;j++){
                            attachments.push(new builder.HeroCard(session)
                                .title(campers[j]["name"])
                                .buttons([
                                    builder.CardAction.imBack(session, campers[j]["email"], "More")
                                ]));
                            choices = choices + campers[j]['email'] + '|';
                            //session.send(choices);
                        }
                        var msg = new builder.Message(session)
                                    .attachmentLayout(builder.AttachmentLayout.carousel)
                                    .attachments(attachments)
                        if (attachments.length == 0){
                            session.send("Sorry couldn't find anyone with those skills");
                            session.endDialog();
                        } else{
                            session.send("Here are a few people....");
                            builder.Prompts.choice(session,msg,choices);
                        }
                    });
                }
            }
        },
        function(session, results){
            var email = results.response.entity;
            campers = session.privateConversationData.bootcampers;
            for (i=0;i<campers.length;i++)
            {
                if (campers[i]["email"] == email){
                    session.privateConversationData.camper = campers[i];
                    var name = campers[i]["name"];
                    var cohort = campers[i]["cohort"];
                    var country = campers[i]["residence_country"];
                    session.send("%s is from %s and lives in %s",name,cohort,country);
                    session.send("You can mail him at %s",email);
                    session.privateConversationData.campers = [];
                    session.endDialog();
                }
            }
        }
    ]);
}