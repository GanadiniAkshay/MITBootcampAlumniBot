module.exports = function (intents,builder){
    intents.matches('getByLocation',[
    function (session,args,next){
        var User = require('../models/user');
        var location = builder.EntityRecognizer.findEntity(args.entities,'builtin.geography.country');
        if (!location){
            var location = builder.EntityRecognizer.findEntity(args.entities,'builtin.geography.city');
            if (!location){
                session.send("Not sure I know what that place is. Try searching by country");
            }
        }
        User.find({"residence_country":{$in : [location.entity]}},function(err, campers){
            console.log(campers);
            session.send(found);
        })
    }
 ]);
}