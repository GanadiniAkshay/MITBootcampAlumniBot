module.exports = function (intents,builder){
    intents.matches('getByLocation',[
    function (session,args,next){
        session.send('paris');
        console.log(builder.EntityRecognizer.findEntity(args.entities,'builtin.geography.country'));
    }
 ]);
}