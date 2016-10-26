module.exports = function(bot,builder,User,client){
    bot.dialog('/verifyEmail',[
    function(session){
        builder.Prompts.text(session,"What's your email?");
    },
    function (session,results){
        email = results.response;
        User.findOne({'email':email},function (err, user){
            if (err){
                console.log(err);
                session.send("Sorry, something went wrong. What can I help you with?");
            }

            if (user){
                otp = Math.floor(Math.random()*900000) + 100000;
                session.privateConversationData.otp = otp;
                client.sendEmail({
                    "From": "mail@akshaykulkarni.online", 
                    "To": email, 
                    "Subject": "MIT Bootcamp - One Time Password", 
                    "TextBody": "Your One Time Password is " + otp
                },function(error, success){
                    if(error) {
                        console.error("Unable to send via postmark: " + error.message);
                        return;
                    }
                    console.info("Sent to postmark for delivery")
                });
                builder.Prompts.text(session,"Please enter the one time password sent to your email");
            }
            else{
                session.send('Oops sorry :(');
                session.send("But I couldn't find your email in the list of bootcampers");
                session.send('Please fill this form to request access https://akshaykulkarni.typeform.com/to/RZq14y');
                session.send("You can still ask me general stuff about the bootcamp");
                session.endDialog();
            }
        });
    },
    function (session,results){
        otp = results.response;
        if (otp == session.privateConversationData.otp){
            session.privateConversationData.otp = "";
            session.userData.isBootcamper = 'true';
            session.send("You can ask me questions about the alumni or general stuff about bootcamp");
            session.endDialog();
        }else{
            builder.Prompts.text(session,"Sorry that's wrong, please enter the correct one time password");
        }
    },
    function(session, results){
        otp = results.response;
        if (otp == session.privateConversationData.otp){
            session.privateConversationData.otp = "";
            session.userData.isBootcamper = 'true';
            session.send("You can ask me questions about the alumni or general stuff about bootcamp");
        } else{
            session.send("Sorry, couldn't verify your email");
            session.send("You can still ask me general stuff about the bootcamp");
        }
        session.endDialog();
    }
]);
}