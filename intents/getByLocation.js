module.exports = function (intents,builder){
    intents.matches('getByLocation',[
    function (session,args,next){
        session.send('paris');
        var location = builder.EntityRecognizer.findEntity(args.entities,'builtin.geography.country');
        if (!location){
            var location = builder.EntityRecognizer.findEntity(args.entities,'builtin.geography.city');
        }
        console.log(location);
    }
 ]);
}