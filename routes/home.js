// Name: Louisa Katlubeck
// Description: js file that drives the Oauth authentication app
// Sources: https://developers.google.com/identity/protocols/OAuth2, 
// http://classes.engr.oregonstate.edu/eecs/spring2018/cs496/module-4/oauth-demo.html

// Routes for the home page
// This page contains a link to the OAuthe 2 endpoint
// The scope is email

module.exports = function () {
    var express = require('express');
    var router = express.Router();
    var randomstring = require('randomstring');
    var request = require('request');

    var state = randomstring.generate();
    var response_type = "code";
    var client_id = "486925704120-osbt0327mu60i2b2flj3d2rgjk4oh92c.apps.googleusercontent.com";
    var redirect_uri = "https://authorize-email.appspot.com/oauth";
    var scope = "email";
    var initialURL = "https://accounts.google.com/o/oauth2/v2/auth?response_type="+response_type+"&client_id="+client_id+"&redirect_uri="+redirect_uri+"&scope="+scope+"&state="+state;

    router.get('/', (req, res) => {
        var context = {};
        var mysql = req.app.get('mysql');

        // get the URL to render
        context.url = initialURL;
        
        // render the page
        res.render('home', context);
    });

    return router;
}();
