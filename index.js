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
var profilesRepo = require('./repos/profiles-repo')(pool);
var teamsRepo = require('./repos/teams-repo')(pool);

//routes
var teamsRoute = require('./lib/routes/teams-route')(teamsRepo, profilesRepo);
var loginRoute = require('./lib/routes/login-route')();
var signupRoute = require('./lib/routes/signup-route')(profilesRepo, stripe, keyPublishable);
var profileRoute = require('./lib/routes/profile-route')(profilesRepo);
var adminRoute = require('./lib/routes/admin-route')(teamsRepo, profilesRepo);

//==========Middleware==========
var app = express();
app.set('port', (process.env.PORT || 5000));

//Static path for CSS
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// HTTPS redirect (Comment if not working locally)
// app.use(function(req, res, next) {
//     if((!req.secure) && (req.get('X-Forwarded-Proto') !== 'https')) {
//         res.redirect('https://' + req.get('Host') + req.url);
//     }
//     else
//         next();
// });

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
    profilesRepo.userLogin(identifier, profile, function(err, user){
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
  if(req.user && !req.user.paid){
    res.redirect('/logout');
  }
	else{
    res.render('pages/index', { user: req.user});
  }
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

app.get('/pick-up-games', function(req, res){
  res.render('pages/pick-up-games', { user: req.user});
});

//Teams route
app.get(teamsRoute.teams.route, teamsRoute.teams.handler);
// app.get(teamsRoute.joinTeam.route, ensureAuthenticated, teamsRoute.joinTeam.handler);
// app.get(teamsRoute.createTeam.route, ensureAuthenticated, teamsRoute.createTeam.handler);
// app.post(teamsRoute.createTeamSubmit.route, teamsRoute.createTeamSubmit.handler);

//Steam login route
app.get(loginRoute.logout.route, loginRoute.logout.handler);
app.get(loginRoute.steamReturn.route, passport.authenticate('steam', { failureRedirect: '/' }), loginRoute.steamReturn.handler);
app.get(loginRoute.steamAuth.route, passport.authenticate('steam', { failureRedirect: '/' }), loginRoute.steamAuth.handler);

//signup route
app.get(signupRoute.signup.route, signupRoute.signup.handler);
app.get(signupRoute.payment.route, ensureAuthenticated, signupRoute.payment.handler);
app.post(signupRoute.signupSubmit.route, ensureAuthenticated, signupRoute.signupSubmit.handler);
app.post(signupRoute.signupCharge.route, ensureAuthenticated, signupRoute.signupCharge.handler);

//profile route
app.get(profileRoute.profile.route, ensureAuthenticated, profileRoute.profile.handler);
app.post(profileRoute.updateEmail.route, ensureAuthenticated, profileRoute.updateEmail.handler);

//Admin route
app.get(adminRoute.admin.route, ensureAuthenticated, adminRoute.admin.handler);
app.get(adminRoute.teams.route, ensureAuthenticated, adminRoute.teams.handler);


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}
