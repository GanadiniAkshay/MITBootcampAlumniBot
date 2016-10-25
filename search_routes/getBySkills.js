module.exports = function (bot){
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
                    if (skills[i] in profession_map){
                        User.find({"skills":{ $in : [profession_map[skills[i]]]}},function(err,campers){
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

                            session.send("Here are a few people....");
                            builder.Prompts.choice(session,msg,choices);
                        });
                    }else{
                        User.find({"skills":{ $in :[skills[i]]}},function(err,campers){
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

                            session.send("Here are a few people....");
                            builder.Prompts.choice(session,msg,choices);
                        });
                    }
                }
            }
        },
        function(session, results){
            session.send('choosed');
            session.endDialog();
        }
    ]);
}