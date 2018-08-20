// Name: Louisa Katlubeck
// Description: server side js for Oauth email authentication app

// Variable set up
var express = require('express');
//var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');
var app = express();
var mysql = require('mysql');
var handlebars = require('express-handlebars').create({ defaultLayout: 'index' });
var request = require('request');

app.engine('handlebars', handlebars.engine);
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('mysql', mysql);
app.set('port', process.argv[2] || 8080);

// Use bodyParser as middleware for post
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Create JSON parser
var jsonParse = bodyParser.json();

// Set up the website pages 
app.use('/', require('./routes/home.js'));
app.use('/oauth', require('./routes/oauth.js'));
app.use('/public', express.static('public')); 

// Set up 404 and 500 errors
app.use((req, res) => {
    res.status(404);
    res.render('404');
});

app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

process.on('uncaughtException', (err) => {
    console.log(err);
}); 

// Run
app.listen(app.get('port'), () => {
    console.log('Express started on port ' + app.get('port') + '; press Ctrl-C to terminate.');
});
