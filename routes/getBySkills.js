module.exports = function (bot, builder, User){
    bot.dialog('/searchBySkills',[
        function (session){
            if (session.userData.isBootcamper != 'true'){
                session.endDialog('You can ask general questions about the bootcamp');
            }else{
                builder.Prompts.text(session,"What skills are you looking for?");
            }
        },
        function (session,results,next){
            session.send('Searching for bootcampers with those skills....')
            session.sendTyping();
            unneccessary = ['write','anyone','anybody','does','did','someone','somebody','who','is','the','an','a','and','&','like','maybe','in','good','at','better','best','person','man','woman','boy','girl','can','do'];
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
                "teacher"      : 'teaching',
                "it"           : 'programming',
                "programmin"   : 'programming',
                "IT"           : 'programming'
            };
            skills = results.response
            skills = skills.replace(/,/g,' ');
            skills = skills.split(' ');
            var found = 0;
            for(i=0;i<skills.length;i++) {
                if (unneccessary.indexOf(skills[i]) == -1) {
                    var search_skill = "";
                    if (skills[i] in profession_map){
                        search_skill = [profession_map[skills[i]]]
                    } else{
                        search_skill = [skills[i]];
                    }
                    User.find({"skills":{$in :[search_skill]}},function(err,campers){
                        if (campers.length > 0){
                            found = 1;
                            attachments = [];
                            for (j=0;j<campers.length;j++){
                                attachments.push(
                                    new builder.HeroCard(session)
                                        .title(campers[j]['name'])
                                        .subtitle(campers[j]["cohort"] + " Lives in " + campers[j]['residence_country'][0] + '. email : ' + campers[j]['email'])
                                )
                            }
                            session.privateConversationData.questionAsked = 'getBySkills';
                            var msg = new builder.Message(session).attachments(attachments);
                            session.send(msg);
                            var replyMessage = new builder.Message(session)
                                            .text('Ask again?');

                            replyMessage.sourceEvent({ 
                                    facebook: { 
                                        quick_replies: [{
                                            content_type:"text",
                                            title:"Yes",
                                            payload:"yes"
                                        },            
                                        {
                                            content_type:"text",
                                            title:"No",
                                            payload:"no"
                                        }]
                                    }
                                });
                            session.endDialog(replyMessage);
                        }

                        else{
                                session.privateConversationData.questionAsked = 'getBySkills';
                                session.send("Couldn't find any bootcampers with those skills");
                                var replyMessage = new builder.Message(session)
                                            .text('Ask again?');

                            replyMessage.sourceEvent({ 
                                    facebook: { 
                                        quick_replies: [{
                                            content_type:"text",
                                            title:"Yes",
                                            payload:"yes"
                                        },            
                                        {
                                            content_type:"text",
                                            title:"No",
                                            payload:"no"
                                        }]
                                    }
                                });
                            session.endDialog(replyMessage);
                        }
                    })
                } 
            }
        }
    ]);
}

