// app/models/user.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({
        email        : String,
        password     : String,
        name         : String,
        year         : String,
        cohort       : String,
        citizenship  : [String],
        languages    : [String],
        skills       : [String],
        residence_city : [String],
        residence_country : [String]
});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);