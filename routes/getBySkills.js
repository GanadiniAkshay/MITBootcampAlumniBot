module.exports = function (bot, builder, User){
    bot.dialog('/searchBySkills',[
        function (session){
            builder.Prompts.text(session,"What skills are you looking for?");
        },
        function (session,results,next){
            session.send('Searching for bootcampers with those skills....')
            session.sendTyping();
            unneccessary = ['anyone','anybody','does','did','someone','somebody','who','is','the','an','a','and','&','like','maybe','in','good','at','better','best','person','man','woman','boy','girl','can','do'];
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
                            attachements = [];
                            for (j=0;j<campers.length;j++){
                                attachements.push(
                                    new builder.HeroCard(session)
                                        .title(campers[j]['name'])
                                        .subtitle("Lives in " + campers[j]['residence_country'] + '. You can mail him at ' + campers[j]['email'])
                                )
                            }
                            session.endDialog("something found");
                        }

                        if (i==skills.length-1){
                            if (found == 0)
                            {
                                session.endDialog("Nothing found");
                            }
                        }
                    })
                } 
            }
        }
    ]);
}