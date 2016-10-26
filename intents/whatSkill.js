module.exports = function (intents,builder){
    intents.matches('whatSkill',[
        function (session,args,next){
            if (session.userData.isBootcamper != 'true'){
                session.endDialog('You can ask general questions about the bootcamp');
            }else{
                session.send("Searching for bootcampers");
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

                    if (skill in profession_map){
                        skill = profession_map[skill]
                    }
                    session.endDialog(skill);
                }else{
                    session.endDialog("Sorry couldn't understand that");
                }
            }
        }
    ])
}