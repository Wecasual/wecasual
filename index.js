"use strict";
//NPM
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
var passportSteam = require('passport-steam');
var url = require('url');
var pg = require('pg');

//Steam API Info
var returnURL = (process.env.SITE_URL || 'http://localhost:5000/') + "auth/steam/return";
var realm = process.env.SITE_URL || 'http://localhost:5000/';
const pgParams = url.parse(process.env.DATABASE_URL);
const pgAuth = pgParams.auth.split(':');
const config = {
  user: pgAuth[0],
  password: pgAuth[1],
  host: pgParams.hostname,
  port: pgParams.port,
  database: pgParams.pathname.split('/')[1],
  ssl: true
};

//Postgres
var pool = new pg.Pool(config);

//repositories
var profiles = require('./repos/profiles');
var teams = require('./repos/teams');

//routes
var teamsRoute = require('./lib/routes/teams-route');
var loginRoute = require('./lib/routes/login-route');

//==========Middleware==========
var app = express();
app.set('port', (process.env.PORT || 5000));

//Static path for CSS
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//Session middleware
app.use(session({
    secret: 'aqua secret',
    name: 'wecasual session',
    resave: true,
    saveUninitialized: true}));

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Express Validator Middleware from https://github.com/ctavan/express-validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//passport-steam Middleware https://github.com/liamcurry/passport-steam
passport.serializeUser(function(user, done) {
  done(null, user);
});


passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


passport.use(new passportSteam.Strategy({
    returnURL: returnURL,
    realm: realm,
    apiKey: process.env.STEAM_API_KEY
  },
  function(identifier, profile, done) {
    pool.connect(function(err, client) {
        if(err){
          return console.error('error', err);
        }
        else{
          profiles.getUser(client, identifier, profile, function(user){
            client.end();
            return done(null, user);
          });
        }
    });
  }
));

app.use(passport.initialize());
app.use(passport.session());


//==========End Middleware==========

app.get('/', function(req, res) {
	let error = req.session.error;
	req.session.error = null;
	let message = req.session.message;
	req.session.message = null;
	res.render('pages/index', { user: req.user, message: message, error: error});
});

app.get('/about', function(req, res){
  res.render('pages/about', { user: req.user});
});



app.get(teamsRoute.joinTeam.route, ensureAuthenticated, teamsRoute.joinTeam.handler);
app.get(teamsRoute.createTeam.route, ensureAuthenticated, teamsRoute.createTeam.handler);

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});
//==========Steam login stuff==========
app.get(loginRoute.logout.route, loginRoute.logout.handler);
app.get(loginRoute.steamReturn.route, passport.authenticate('steam', { failureRedirect: '/' }), loginRoute.steamReturn.handler);
app.get(loginRoute.steamAuth.route, passport.authenticate('steam', { failureRedirect: '/' }), loginRoute.steamAuth.handler);
app.get(loginRoute.signup.route, loginRoute.signup.handler);
//==========End steam login stuff==========

app.post('/mailingList/add', function(req, res){
	req.checkBody('email', 'Please enter your email address').notEmpty();
	req.checkBody('email', 'Please enter a valid email address').isEmail();

	let error = req.validationErrors();
	let message = null;

	if(error){
		req.session.error = error[0].msg;
		res.redirect('/');
	}
	else{
		let newEmail = req.body.email;
    pool.connect(function(err, client){
      if(err){
        req.session.error = "Error adding email. Please try again later";
        return console.error('error', err);
      }
        profiles.updateEmail(client, newEmail, function(err){
          if(err){
            req.session.error = "Error adding email. Please try again later";
            return console.error('error', err);
          }
          client.end();
        })
    });
  }
  req.session.message = "Email added successfully";
  res.redirect('/');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}
