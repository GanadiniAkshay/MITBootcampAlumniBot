module.exports = function (intents,builder){
    intents.matches('getByLocation',[
    function (session,args,next){
        session.send('paris');
        var User = require('../models/user');
        var location = builder.EntityRecognizer.findEntity(args.entities,'builtin.geography.country');
        if (!location){
            var location = builder.EntityRecognizer.findEntity(args.entities,'builtin.geography.city');
            if (!location){
                session.send("Not sure I know what that place is. Try searching by country");
            }
            User.find({"residence_city":location.entity},function(err,campers){
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
                session.send(msg);
            }
            session.send("Sorry couldn't find anyone");
        });
        }
        console.log(location.entity);
        User.find({"residence_country":location.entity},function(err,campers){
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
                session.send(msg);
            }
            session.send("Sorry couldn't find anyone");
        });
    }
 ]);
}