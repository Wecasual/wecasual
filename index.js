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


//Stripe
const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;
var stripe = require('stripe')(keySecret);

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
var profiles = require('./repos/profiles')(pool);
var teams = require('./repos/teams')(pool);

//routes
var teamsRoute = require('./lib/routes/teams-route')(teams, profiles);
var loginRoute = require('./lib/routes/login-route')();
var signupRoute = require('./lib/routes/signup-route')(profiles, stripe, keyPublishable);
var profileRoute = require('./lib/routes/profile-route')(profiles);



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
    profiles.getUser(identifier, profile, function(err, user){
      if(err) {
        console.log("Unable to login");
      }
      else {
        return done(null, user);
      }
    });
  }
));

app.use(passport.initialize());
app.use(passport.session());


//==========End Middleware==========

app.get('/', function(req, res) {
	res.render('pages/index', { user: req.user});
});

app.get('/about', function(req, res){
  res.render('pages/about', { user: req.user});
});

app.get('/rules', function(req, res){
  res.render('pages/rules', { user: req.user});
});

app.get('/schedule', function(req, res){
  res.render('pages/schedule', { user: req.user});
});

app.get('/events', function(req, res){
  res.render('pages/events', { user: req.user});
});

app.get(teamsRoute.teamsPage.route, teamsRoute.teamsPage.handler);
// app.get(teamsRoute.joinTeam.route, ensureAuthenticated, teamsRoute.joinTeam.handler);
// app.get(teamsRoute.createTeam.route, ensureAuthenticated, teamsRoute.createTeam.handler);

//==========Steam login stuff==========
app.get(loginRoute.logout.route, loginRoute.logout.handler);
app.get(loginRoute.steamReturn.route, passport.authenticate('steam', { failureRedirect: '/' }), loginRoute.steamReturn.handler);
app.get(loginRoute.steamAuth.route, passport.authenticate('steam', { failureRedirect: '/' }), loginRoute.steamAuth.handler);
//==========End steam login stuff==========

app.get(signupRoute.signup.route, signupRoute.signup.handler);
app.get(signupRoute.payment.route, ensureAuthenticated, signupRoute.payment.handler);
app.get(profileRoute.profile.route, ensureAuthenticated, profileRoute.profile.handler);

app.post(signupRoute.signupSubmit.route, ensureAuthenticated, signupRoute.signupSubmit.handler);
app.post(signupRoute.signupCharge.route, ensureAuthenticated, signupRoute.signupCharge.handler);
// app.post(teamsRoute.createTeamSubmit.route, teamsRoute.createTeamSubmit.handler);
app.post(profileRoute.updateEmail.route, ensureAuthenticated, profileRoute.updateEmail.handler);


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}
