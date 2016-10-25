module.exports = function (intents,builder){
    intents.matches('whatAlumni',[
    function (session){
        session.sendTyping();
        session.send("Here are somethings you can ask");
        
        // Ask the user to select an item from a carousel.
        var msg = new builder.Message(session)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments([
                new builder.HeroCard(session)
                    .title("Search Bootcampers by Name")
                    .subtitle("You can search the alumni by name")
                    .images([
                        builder.CardImage.create(session, "https://i.ytimg.com/vi/4EZ-fg1UIaQ/maxresdefault.jpg")
                    ])
                    .buttons([
                        builder.CardAction.imBack(session, "select:100", "Search by Name")
                    ]),
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
                    ]),
                new builder.HeroCard(session)
                    .title("Search Bootcampers by Language")
                    .subtitle("You can search the alumni by language they speak")
                    .images([
                        builder.CardImage.create(session, "http://rightbrainrevival.com/wp-content/uploads/2016/06/Learning-a-language-with-Zen.png")
                    ])
                    .buttons([
                        builder.CardAction.imBack(session, "select:103", "Search by Language")
                    ])
            ]);
        builder.Prompts.choice(session, msg, "select:100|select:101|select:102|select:103");
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
            case '100':
                session.beginDialog('/searchByName');
                break;
            case '101':
                session.beginDialog('/searchBySkills');
                break;
            case '102':
                session.beginDialog('/searchByLocation');
                break;
            case '103':
                session.beginDialog('/searchByLanguage');
                break;
        }
    }  
]);
} 