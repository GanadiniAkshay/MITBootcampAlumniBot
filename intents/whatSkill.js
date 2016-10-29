module.exports = function (intents,builder){
    intents.matches('whatSkill',[
        function (session,args,next){
            if (session.userData.isBootcamper != 'true'){
                session.endDialog('You can ask general questions about the bootcamp');
            }else{
                session.send("Searching for bootcampers...");
                session.sendTyping();
                var User = require('../models/user');
                var skill = builder.EntityRecognizer.findEntity(args.entities,'skill');
                if (skill){
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
                    skill = skill.entity;
                    if (skill in profession_map){
                        skill = profession_map[skill]
                    }
                    User.find({"skills":{$in : [skill]}},function(err, campers){
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
                            var msg = new builder.Message(session).attachments(attachments);
                            session.endDialog(msg);
                        }

                        else{
                                session.endDialog("Couldn't find any bootcampers with those skills");
                        }
                    });
                }else{
                    session.endDialog("Sorry couldn't understand that");
                }
            }
        }
    ])
}