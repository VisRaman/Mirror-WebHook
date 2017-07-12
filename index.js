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

    var speech = req.body.result && req.body.result.action ? req.body.result.action : NO_INTENT;

    if (speech.valueOf()== MILESTONES.valueOf()) {
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
                            finalString = finalString + value + ', ';
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
                        speech: 'There are milestone feeds for today',
                        displayText: 'There are milestone feeds for today',
                        source: 'mirror-webhook-heroku',
                        suggestions: suggestion
                    });
                }
            });
    }

    else if (speech.valueOf()== ANNIVERSARY.valueOf()) {
        requestapp.get({
                url: 'http://teamcantiz:megamirror156@stg.mirror.attinadsoftware.com:8080/wedding_anniversaries.json'
            },
            function (request, response, body){

                var resFinal = responseSerialization(body);
                if (resFinal!=null) {
                    var finalString ='';
                    for (var key in resFinal) {
                        finalString = finalString + ' People celebrating ' + key + ' year of happy married life ';
                        resFinal[key].forEach(function (value) {
                            finalString = finalString + value + ', ';
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
                        speech: 'There are milestone feeds for today',
                        displayText: 'There are milestone feeds for today',
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

    else if (speech.valueOf()== BIRTHDAYS.valueOf()) {
        requestapp.get({
                url: 'http://teamcantiz:megamirror156@stg.mirror.attinadsoftware.com:8080/birthdays.json'
            },
            function (request, response, body){

                var resFinal = parseBirthdayResponse(body);
               if (resFinal == ''){
                   return res.json({
                       speech: 'There are no birthday babies today',
                       displayText: 'There are no birthday babies today',
                       source: 'mirror-webhook-heroku',
                       suggestions: suggestion
                   });
               }else{
                   return res.json({
                       speech: 'Todays birthday babies are ' + resFinal,
                       displayText: 'Todays birthday babies are ' + resFinal,
                       source: 'mirror-webhook-heroku',
                       suggestions: suggestion
                   });
               }
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


restService.listen((process.env.PORT || 8000), function() {
    console.log("Server up and listening");
});

function responseSerialization(body)
{
    var resFinal = {};
    var jsonBody = JSON.parse(body);
    if (!Object.keys(jsonBody).length === 0) {
        
        for (var key in jsonBody) {
            if (jsonBody[key] != null) {
                var objArr = [];
                jsonBody[key].forEach(function (value) {
                    objArr.push(value.name);
                });
                resFinal[key] = objArr;
            }
        }
        return resFinal;
    }
    else {
        return null;
    }
}

function parseBirthdayResponse(body) {
    var resFinal = '';
    if (body == null) {
    }
    else {
        var responseArr = JSON.parse(body);
        for (var i = 0; i<responseArr.length; i++) {
            if (responseArr[i] != null) {
                resFinal = resFinal + responseArr[i].name + ', ';
            }
        }
    }
    return resFinal;
}
