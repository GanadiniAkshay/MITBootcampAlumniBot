module.exports = function (bot,builder,User,client){
    require('./routes/verifyEmail.js')(bot,builder,User,client);
    require('./routes/getByName.js')(bot,builder,User);
    require('./routes/getBySkills.js')(bot,builder,User);
    require('./routes/getByLocation.js')(bot,builder,User);
    require('./routes/getByLanguage.js')(bot,builder,User);
}