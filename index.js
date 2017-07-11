'use strict';

const express = require('express');
const bodyParser = require('body-parser');
var requestapp = require('request');

const BIRTHDAYS = 'Birthday_Intent';
const MILESTONES = 'Milestone_Intent';
const ANNIVERSARY = 'Anniversay_Intent';
const WELCOME = 'input.welcome';
const NO_INTENT = 'no_intent';


const restService = express();

restService.use(bodyParser.urlencoded({
    extended: true
}));

restService.use(bodyParser.json());

restService.post('/mirror', function(req, res) {
    var suggestion = [];
    suggestion.push(
    {
        "title" : "Birthdays"
    },
    {
        "title": "Milestones"
    },
    {
        "title": "Wedding Anniversary"
    }
    );

    var speech = req.body.result && req.body.result.action ? req.body.result.action : NO_INTENT
    if (speech.valueOf()== BIRTHDAYS.valueOf())
    {
        requestapp.get({
                url: 'http://teamcantiz:megamirror156@stg.mirror.attinadsoftware.com:8080/milestones.json'
            },
            function (request, response, body){

                var resFinal = responseSerialization(body);
                if (resFinal!=null) {
                    var finalString ='';
                    for (var key in resFinal) {
                        finalString = finalString + ' People celebrating ' + key + ' year milestone ';
                        resFinal[key].forEach(function (value) {
                            finalString = finalString + value + ' ,';
                        });
                    }

                    console.log('res final ' + finalString);

                    return res.json({
                        speech: finalString,
                        displayText: finalString,
                        source: 'mirror-webhook-heroku',
                        suggestions: suggestion
                    });
                }
                else {
                    return res.json({
                        speech: 'Welcome to birthday Intent',
                        displayText: 'Welcome to birthday Intent',
                        source: 'mirror-webhook-heroku',
                        suggestions: suggestion
                    });
                }
            });
    }
    else if (speech.valueOf()== WELCOME.valueOf()){
        return res.json({
            speech: 'Welcome to Cantiz Mirror, you can find the Milestones, Birthdays, ' +
            'and wedding anniversarys for today. So,  which feeds you would like to hear ?',
            displayText: 'Welcome to Cantiz Mirror',
            source: 'mirror-webhook-heroku'
        });
    }

    else if (speech.valueOf()== NO_INTENT.valueOf()){
        return res.json({
            speech: 'Some problem with Google, please visit us again',
            displayText: 'Some problem with Google, please visit us again',
            source: 'mirror-webhook-heroku'
        });
    }

});

restService.post('/slack-test', function(req, res) {

    var slack_message = {
        "text": "Details of JIRA board for Browse and Commerce",
        "attachments": [{
            "title": "JIRA Board",
            "title_link": "http://www.google.com",
            "color": "#36a64f",

            "fields": [{
                "title": "Epic Count",
                "value": "50",
                "short": "false"
            }, {
                "title": "Story Count",
                "value": "40",
                "short": "false"
            }],

            "thumb_url": "https://stiltsoft.com/blog/wp-content/uploads/2016/01/5.jira_.png"
        }, {
            "title": "Story status count",
            "title_link": "http://www.google.com",
            "color": "#f49e42",

            "fields": [{
                "title": "Not started",
                "value": "50",
                "short": "false"
            }, {
                "title": "Development",
                "value": "40",
                "short": "false"
            }, {
                "title": "Development",
                "value": "40",
                "short": "false"
            }, {
                "title": "Development",
                "value": "40",
                "short": "false"
            }]
        }]
    }
    return res.json({
        speech: "speech",
        displayText: "speech",
        source: 'webhook-echo-sample',
        data: {
            "slack": slack_message
        }
    });
});




restService.listen((process.env.PORT || 8000), function() {
    console.log("Server up and listening");
});
