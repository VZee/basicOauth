// Route for getting the oauth token and using it to access and display information
// The information will include the user's first and last name, a link to the email
// account that they authorized, and the state variable used in the original request
// Sources: https://stackoverflow.com/questions/25965220/making-http-requests-from-server-side,
// http://classes.engr.oregonstate.edu/eecs/spring2018/cs496/module-4/oauth-demo.html,
// https://stackoverflow.com/questions/7130648/get-user-info-via-google-api,
// https://stackoverflow.com/questions/40063875/error-options-uri-is-a-required-argument,
// https://stackoverflow.com/questions/40537749/how-do-i-make-a-https-post-in-node-js-without-any-third-party-module,
// https://developer.salesforce.com/forums/?id=906F00000008nFOIAY, https://stackoverflow.com/questions/17121846/node-js-how-to-send-headers-with-form-data-using-request-module,
// https://developers.google.com/maps/documentation/javascript/get-api-key

module.exports = function () {
    var express = require('express');
    var router = express.Router();
    var request = require('request');
    var http = require('http');
    var querystring = require('querystring');
    var https = require('https');

    router.get('/', (req, res) => {
        var mysql = req.app.get('mysql');

        // get query variables
        var state = req.query.state;
        var my_code = req.query.code;

        var body = {
            client_id: "486925704120-osbt0327mu60i2b2flj3d2rgjk4oh92c.apps.googleusercontent.com",
            redirect_uri: "https://authorize-email.appspot.com/oauth",
            grant_type: "authorization_code",
            code: my_code,
            client_secret: "N-tAUOhQqchS-UFHQJaAetH9"
        };

        var bodyData = querystring.stringify(body);
        console.log(bodyData);

        // exchange the code for a token
        request({
            uri: 'https://www.googleapis.com/oauth2/v4/token?',
            headers: {
                'Content-Length': bodyData.length,
                'Content-Type': "application/x-www-form-urlencoded"
            },
            body: bodyData,
            method: 'POST'
        }, (err, response, body) => {
            if (response.statusCode == 200) {
                // get the access token
                var jsonData = JSON.parse(response.body);
                var my_token = jsonData.access_token;
                var total_token = "Bearer " + my_token;

                // use the token to get the person
                request({
                    uri: 'https://www.googleapis.com/plus/v1/people/me?key=AIzaSyDfytdw7OeucL3zmDKodKGGctBRrzIboKk',
                    headers: {
                        'Authorization': total_token
                    },
                    method: 'GET'
                }, (e, r, b) => {
                    // parse the person
                    var myData = JSON.parse(r.body);
                    console.log(myData);

                    var context = {};

                    // get the individual items
                    context.first_name = myData.name.givenName;
                    context.last_name = myData.name.familyName;
                    context.url = myData.url;
                    context.state = state;

                    // check for null values
                    if(myData.name.givenName == "") context.first_name = "No first name associated with this user";
                    if(myData.name.familyName == "") context.last_name = "No last name associated with this user";
                    if(myData.url == null) context.url = "";

                    // render
                    res.render('oauth', context);
                });
            }
        });
    });

return router;
}();