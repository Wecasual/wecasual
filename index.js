"use strict";
//NPM
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var cookieSession = require('cookie-session')
var passport = require('passport');
// var passportSteam = require('passport-steam');
// var Auth0Strategy = require('passport-auth0');
var passportDiscord = require('passport-discord');
var url = require('url');
var Airtable = require('airtable');
var sitemap = require('express-sitemap')({url: 'wecasual.gg'});



// var pg = require('pg');

//Butter
var butter = require('buttercms')('1df90da7cb8d018960e1e922c67506357c568652');

//Airtable
var base = new Airtable({apiKey: process.env.AIRTABLE_KEY}).base('appQNrirLcYjjQZkZ');

// var baseDota = new Airtable({apiKey: process.env.AIRTABLE_KEY}).base('appj7HjmgCn8ctYDU');
// var baseLol = new Airtable({apiKey: process.env.AIRTABLE_KEY}).base('appCUfOoXm19TJWfl');

//Stripe
// const keyPublishable = process.env.PUBLISHABLE_KEY;
// const keySecret = process.env.SECRET_KEY;
// var stripe = require('stripe')(keySecret);

//Steam API Info
var returnURLDota = (process.env.SITE_URL || 'http://localhost:5000/') + "auth/steam/return";
var realmDota = process.env.SITE_URL || 'http://localhost:5000/';

var returnURLLol = (process.env.SITE_URL || 'http://localhost:5000/') + "auth0/return";

var returnURLDiscord = (process.env.SITE_URL || 'http://localhost:5000/') + "auth/discord/callback";
// const pgParams = url.parse(process.env.DATABASE_URL);
// const pgAuth = pgParams.auth.split(':');
// const config = {
//   user: pgAuth[0],
//   password: pgAuth[1],
//   host: pgParams.hostname,
//   port: pgParams.port,
//   database: pgParams.pathname.split('/')[1],
//   ssl: true
// };

//Postgres
// var pool = new pg.Pool(config);

//Dota routes
// var profilesRepoDota = require('./repos/dota/profiles-repo')(baseDota);
// var scheduleRepoDota = require('./repos/dota/schedule-repo')(baseDota);
// var contactRepoDota = require('./repos/contact-repo')(baseDota);
//
// var loginRouteDota = require('./lib/routes/dota/login-route')();
// var signupRouteDota = require('./lib/routes/dota/signup-route')(profilesRepoDota);
// var scheduleRouteDota = require('./lib/routes/dota/schedule-route')(scheduleRepoDota);
// var contactRouteDota = require('./lib/routes/dota/contact-route')(contactRepoDota);
// var profileRouteDota = require('./lib/routes/dota/profile-route')(profilesRepoDota);
//
// //LoL routes
// var profilesRepoLol = require('./repos/lol/profiles-repo')(baseLol);
// var scheduleRepoLol = require('./repos/lol/schedule-repo')(baseLol);
// var contactRepoLol = require('./repos/contact-repo')(baseLol);
//
// var loginRouteLol = require('./lib/routes/lol/login-route')();
// var signupRouteLol = require('./lib/routes/lol/signup-route')(profilesRepoLol);
// var scheduleRouteLol = require('./lib/routes/lol/schedule-route')(scheduleRepoLol);
// var contactRouteLol = require('./lib/routes/lol/contact-route')(contactRepoLol);

var profilesRepo = require('./repos/profiles-repo')(base);
var scheduleRepo = require('./repos/schedule-repo')(base);
var contactRepo = require('./repos/contact-repo')(base);

var profileRoute = require('./lib/routes/profile-route')(profilesRepo);
var loginRoute = require('./lib/routes/login-route')();
var signupRoute = require('./lib/routes/signup-route')(profilesRepo);
var scheduleRoute = require('./lib/routes/schedule-route')(scheduleRepo);
var contactRoute = require('./lib/routes/contact-route')(contactRepo);


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
app.use(cookieSession({
  name: 'session',
  keys: ['Aqua secret'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 * 365// 1 day
}))

//Sitemap middleware



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
// passport.use(new passportSteam.Strategy({
//     returnURL: returnURLDota,
//     realm: realmDota,
//     apiKey: process.env.STEAM_API_KEY
//   },
//   function(identifier, profile, done) {
//     profilesRepoDota.userLogin(identifier, profile, function(err, user){
//       if(err) {
//         console.log(err);
//         return done(null, null);
//       }
//       // console.log(user);
//       return done(null, user);
//     });
//   }
// ));
//
// passport.use(new Auth0Strategy(
//   {
//     domain: process.env.AUTH0_DOMAIN,
//     clientID: process.env.AUTH0_CLIENT_ID,
//     clientSecret: process.env.AUTH0_SECRET,
//     callbackURL: returnURLLol,
//   },
//   function(accessToken, refreshToken, extraParams, profile, done) {
//     profilesRepoLol.userLogin(profile, function(err, user){
//       if(err) {
//         console.log(err);
//         return done(null, null);
//       }
//       // console.log(user);
//       return done(null, user);
//     });
//   }
// ));

passport.use(new passportDiscord.Strategy({
    clientID: process.env.DISCORD_ID,
    clientSecret: process.env.DISCORD_SECRET,
    callbackURL: returnURLDiscord,
    scope: ['identify'],
    response_type: ['code']
  },
  function(accessToken, refreshToken, profile, done) {
    profilesRepo.userLogin(profile, function(err, user){
      if(err) {
        console.log(err);
        return done(null, null);
      }
      return done(null, user);
    });
  }));

passport.serializeUser(function(user, done) {
  done(null, user);
});


passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


app.use(passport.initialize());
app.use(passport.session());


//==========End Middleware==========


app.get('/', function(req, res){
  res.render('pages/landing');
});

//login route
app.get(loginRoute.authDiscord.route, passport.authenticate('discord'));
app.get(loginRoute.authDiscordCallback.route, passport.authenticate('discord', {failureRedirect: '/'}), loginRoute.authDiscordCallback.handler);
app.get(loginRoute.logout.route, loginRoute.logout.handler);

//signup route
app.get(signupRoute.signup.route, signupRoute.signup.handler);
app.post(signupRoute.submit.route, ensureAuthenticated, signupRoute.submit.handler);

//schedule route
app.post(scheduleRoute.getAllSchedule.route, ensureAuthenticated, scheduleRoute.getAllSchedule.handler);
app.post(scheduleRoute.gameSignup.route, ensureAuthenticated, scheduleRoute.gameSignup.handler);

//contact route
app.get(contactRoute.contact.route, contactRoute.contact.handler);
app.post(contactRoute.submit.route, contactRoute.submit.handler);

//==========Dota Routes==========
app.get('/dota', function(req, res) {
  if(req.user && (req.user['Status'] == 'Not Registered')){
    // console.log(req.user['Status']);
    res.redirect('/logout');
  }
  else if(req.user && req.user['Status'] != 'Not Registered'){
    var message = req.session.message;
    req.session.message = null;
    req.session.realm = "dota";
    res.render('pages/dota/home', { user: req.user, message: message});
  }
  else{
    req.session.realm = "dota";
    res.render('pages/dota/index', {user: req.user});
  }
});

app.get('/dota/about', function(req, res){
  res.render('pages/dota/about', { user: req.user});
});

app.get('/dota/rules', function(req, res){
  res.render('pages/dota/rules', { user: req.user});
});

app.get('/dota/schedule', function(req, res){
  res.render('pages/dota/schedule', { user: req.user});
});

app.get('/dota/FAQ', function(req, res){
  res.render('pages/dota/FAQ', { user: req.user});
});

app.get('/dota/thank-you-signup', ensureAuthenticated, function(req, res){
  res.render('pages/dota/thank-you-signup', { user: req.user});
});

// //butter
app.get('/dota/blog', renderHome)
app.get('/dota/blog/p/:page', renderHome)
app.get('/dota/blog/:slug', renderPost)

//Steam login route
// app.get(loginRouteDota.logout.route, loginRouteDota.logout.handler);
// app.get(loginRouteDota.steamReturn.route, passport.authenticate('steam', { failureRedirect: '/dota' }), loginRouteDota.steamReturn.handler);
// app.get(loginRouteDota.steamAuth.route, passport.authenticate('steam', { failureRedirect: '/dota' }), loginRouteDota.steamAuth.handler);
//
// //signup route

//

//

//
// //profile route
// app.post(profileRouteDota.getFriends.route, profileRouteDota.getFriends.handler);
// app.post(profileRouteDota.acceptFriend.route, profileRouteDota.acceptFriend.handler);
// app.post(profileRouteDota.declineFriend.route, profileRouteDota.declineFriend.handler);
// app.post(profileRouteDota.sendFriendRequest.route, profileRouteDota.sendFriendRequest.handler);


//==========LoL Routes==========
app.get('/lol', function(req, res) {
  if(req.user && (req.user['Status'] == 'Not Registered')){
    // console.log(req.user['Status']);
    res.redirect('/logout');
  }
  else if(req.user && req.user['Status'] != 'Not Registered'){
    var message = req.session.message;
    req.session.message = null;
    req.session.realm = "lol";
    res.render('pages/lol/home', { user: req.user, message: message});
  }
  else{
    req.session.realm = "lol";
    res.render('pages/lol/index', {user: req.user});
  }
});
//
// app.get('/lol/about', function(req, res){
//   res.render('pages/lol/about', { user: req.user});
// });
//
// app.get('/lol/rules', function(req, res){
//   res.render('pages/lol/rules', { user: req.user});
// });
//
// app.get('/lol/schedule', function(req, res){
//   res.render('pages/lol/schedule', { user: req.user});
// });
//
// app.get('/lol/FAQ', function(req, res){
//   res.render('pages/lol/FAQ', { user: req.user});
// });
//
app.get('/lol/thank-you-signup', ensureAuthenticated, function(req, res){
  res.render('pages/lol/thank-you-signup', { user: req.user});
});

// //butter
// app.get('/lol/blog', renderHome)
// app.get('/lol/blog/p/:page', renderHome)
// app.get('/lol/blog/:slug', renderPost)

//Auth0 login route
// app.get(loginRouteLol.logout.route, loginRouteLol.logout.handler);
// app.get(loginRouteLol.authReturn.route, passport.authenticate('auth0', { failureRedirect: '/lol' }), loginRouteLol.authReturn.handler);
// app.get(loginRouteLol.login.route, passport.authenticate('auth0', {
//     clientID: process.env.AUTH0_CLIENT_ID,
//     domain: process.env.AUTH0_DOMAIN,
//     redirectUri: returnURLLol,
//     audience: 'https://' + process.env.AUTH0_DOMAIN + '/userinfo',
//     responseType: 'code',
//     scope: 'openid profile'}),
//     loginRouteLol.login.handler);
//
// //signup route
// app.get(signupRoute.signup.route, signupRoute.signup.handler);
// app.post(signupRouteLol.submit.route, ensureAuthenticated, signupRouteLol.submit.handler);
//
// //schedule route
// app.post(scheduleRouteLol.getAllSchedule.route, ensureAuthenticated, scheduleRouteLol.getAllSchedule.handler);
// app.post(scheduleRouteLol.gameSignup.route, ensureAuthenticated, scheduleRouteLol.gameSignup.handler);
//
// //contact route
// app.get(contactRouteLol.contact.route, contactRouteLol.contact.handler);
// app.post(contactRouteLol.submit.route, contactRouteLol.submit.handler);

app.get('/sitemap.xml', function(req, res){
  sitemap.generate(app);
  sitemap.XMLtoWeb(res);
});



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}


//Butter display
function renderHome(req, res) {
  var page = req.params.page || 1;

  butter.post.list({page_size: 10, page: page}).then(function(resp) {
    res.render('pages/dota/blog', {
      user: req.user,
      posts: resp.data.data,
      next_page: resp.data.meta.next_page,
      previous_page: resp.data.meta.previous_page,
    })
  })
}

function renderPost(req, res) {
  var slug = req.params.slug;

  butter.post.retrieve(slug).then(function(resp) {
    res.render('pages/dota/post', {
      user: req.user,
      title: resp.data.data.title,
      post: resp.data.data,
      published: new Date(resp.data.data.published)
    })
  })
}
