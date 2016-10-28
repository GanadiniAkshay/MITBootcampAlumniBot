module.exports = function(bot,builder,User,client){
    bot.dialog('/verifyEmail',[
    function(session){
        builder.Prompts.text(session,"What's your email?");
    },
    function (session,results){
        email = results.response;
        email = email.toLowerCase();
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
            session.send("Here are somethings you can ask");
            
            // Ask the user to select an item from a carousel.
            var msg = new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments([
                    new builder.HeroCard(session)
                        .title("Search Bootcampers by Skills")
                        .subtitle("You can search the alumni by skills")
                        .images([
                            builder.CardImage.create(session, "https://cdn.elegantthemes.com/blog/wp-content/uploads/2015/11/Essential-Skills-Top-10-shutterstock_285431867.png")
                        ])
                        .buttons([
                            builder.CardAction.imBack(session, "select:101", "Search by Skills")
                        ]),
                    new builder.HeroCard(session)
                        .title("Search Bootcampers by Location")
                        .subtitle("You can search the alumni by location")
                        .images([
                            builder.CardImage.create(session, "http://i.huffpost.com/gen/1378629/images/o-LOCATION-MAP-facebook.jpg")
                        ])
                        .buttons([
                            builder.CardAction.imBack(session, "select:102", "Search by Location")
                        ])
                ]);
            builder.Prompts.choice(session, msg, "select:101|select:102");
        }else{
            session.send("Sorry, couldn't verify your email");
            session.send("You can still ask me general stuff about the bootcamp");
            session.endDialog();
        }
    },
    function (session, results) {
        var action, item;
        var kvPair = results.response.entity.split(':');
        switch (kvPair[0]) {
            case 'select':
                action = 'selected';
                break;
        }
        switch (kvPair[1]) {
            case '101':
                session.beginDialog('/searchBySkills');
                break;
            case '102':
                session.beginDialog('/searchByLocation');
                break;
        }
    } 
]);
}