"use strict";
//NPM
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var cookieSession = require('cookie-session')
var passport = require('passport');
var discordIo = require('discord.io');
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
var base = new Airtable({apiKey: process.env.AIRTABLE_KEY}).base('appj7HjmgCn8ctYDU');

// var baseDota = new Airtable({apiKey: process.env.AIRTABLE_KEY}).base('appj7HjmgCn8ctYDU');
// var baseLol = new Airtable({apiKey: process.env.AIRTABLE_KEY}).base('appCUfOoXm19TJWfl');

//Stripe
// const keyPublishable = process.env.PUBLISHABLE_KEY;
// const keySecret = process.env.SECRET_KEY;
// var stripe = require('stripe')(keySecret);

//Steam API Info
// var returnURLDota = (process.env.SITE_URL || 'http://localhost:5000/') + "auth/steam/return";
// var realmDota = process.env.SITE_URL || 'http://localhost:5000/';
//
// var returnURLLol = (process.env.SITE_URL || 'http://localhost:5000/') + "auth0/return";

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

var admins = ["148219528470462464", "148285628478390272"];

var bot = new discordIo.Client({
    token: process.env.BOT_TOKEN,
    autorun: true
});

var discordBot = require('./bots/discord-bot')(bot);
discordBot.init(admins);

var profilesRepo = require('./repos/profiles-repo')(base);
var scheduleRepo = require('./repos/schedule-repo')(base);
var contactRepo = require('./repos/contact-repo')(base);

var profileRoute = require('./lib/routes/profile-route')(profilesRepo);
var loginRoute = require('./lib/routes/login-route')();
var signupRoute = require('./lib/routes/signup-route')(profilesRepo);
var scheduleRoute = require('./lib/routes/schedule-route')(scheduleRepo, discordBot);
var contactRoute = require('./lib/routes/contact-route')(contactRepo);
var profileRoute = require('./lib/routes/profile-route')(profilesRepo);



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
  maxAge: 24 * 60 * 60 * 1000 * 365// 1 year
}))

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
  if(req.user && (req.user['Status'] == 'Not Registered' || req.user['Discord Id'] == null)){
    // console.log(req.user['Status']);
    res.redirect('/logout');
  }
  else if(req.user){
    res.redirect('/dota');
  }
  else{
    res.render('pages/landing', {user: req.user, realm: null});
  }
});

//login route
app.get(loginRoute.authDiscord.route, ensureRealm, passport.authenticate('discord'));
app.get(loginRoute.authDiscordCallback.route, ensureRealm, passport.authenticate('discord', {failureRedirect: '/'}), loginRoute.authDiscordCallback.handler);
app.get(loginRoute.logout.route, loginRoute.logout.handler);

//signup route
app.get(signupRoute.signup.route, ensureRealm, signupRoute.signup.handler);
app.get(signupRoute.dotaSignup.route, ensureRealm, signupRoute.dotaSignup.handler);
app.get(signupRoute.lolSignup.route, ensureRealm, signupRoute.lolSignup.handler);
app.post(signupRoute.submit.route, ensureRealm, ensureAuthenticated, signupRoute.submit.handler);
app.post(signupRoute.submitSkillLevel.route, ensureRealm, ensureAuthenticated, signupRoute.submitSkillLevel.handler);

//schedule route
app.get(scheduleRoute.dotaQuickLink.route, ensureRealm, ensureAuthenticated, scheduleRoute.dotaQuickLink.handler);
app.post(scheduleRoute.getSingleGame.route, ensureRealm, ensureAuthenticated, scheduleRoute.getSingleGame.handler);
app.post(scheduleRoute.getAllSchedule.route, ensureRealm, ensureAuthenticated, scheduleRoute.getAllSchedule.handler);
app.post(scheduleRoute.gameSignup.route, ensureRealm, ensureAuthenticated, scheduleRoute.gameSignup.handler);
app.post(scheduleRoute.scheduleGame.route, ensureRealm, ensureAuthenticated, scheduleRoute.scheduleGame.handler);


//contact route
app.get(contactRoute.contact.route, ensureRealm,  contactRoute.contact.handler);
app.post(contactRoute.submit.route, ensureRealm, contactRoute.submit.handler);

//profile route
app.post(profileRoute.getFriends.route, ensureRealm, profileRoute.getFriends.handler);
app.post(profileRoute.acceptFriend.route, ensureRealm, profileRoute.acceptFriend.handler);
app.post(profileRoute.declineFriend.route, ensureRealm, profileRoute.declineFriend.handler);
app.post(profileRoute.sendFriendRequest.route, ensureRealm, profileRoute.sendFriendRequest.handler);
app.post(profileRoute.getAllUsers.route, ensureRealm, profileRoute.getAllUsers.handler);



//==========Dota Routes==========
app.get('/dota', ensureRealm, function(req, res) {
  if(!req.user){
    res.redirect('/');
  }
  else if(req.user && (req.user['Status'] == 'Not Registered' || req.user['Discord Id'] == null)){
    // console.log(req.user['Status']);
    res.redirect('/logout');
  }
  else if((req.user && req.user['Status'] != 'Not Registered' && !req.user['dota']) || !req.user) {
    res.redirect('/dota/signup');
  }
  else{
    var message = req.session.message;
    req.session.message = null;
    res.render('pages/dota/home', { user: req.user, message: message, realm: req.session.realm});
  }
});

app.get('/about', ensureRealm, function(req, res){
  res.render('pages/about', { user: req.user, realm: req.session.realm});
});

app.get('/FAQ', ensureRealm, function(req, res){
  res.render('pages/FAQ', { user: req.user, realm: req.session.realm});
});

app.get('/dota/rules', ensureRealm, function(req, res){
  res.render('pages/dota/rules', { user: req.user, realm: req.session.realm});
});

app.get('/dota/schedule', ensureRealm, function(req, res){
  res.render('pages/dota/schedule', { user: req.user});
});

app.get('/dota/players', ensureRealm, function(req, res){
  res.render('pages/dota/players',  { user: req.user, realm: req.session.realm});
});

app.get('/dota/teams', ensureRealm, function(req, res){
  res.render('pages/dota/teams',  { user: req.user, realm: req.session.realm});
});

// app.get('/dota/FAQ', ensureRealm, function(req, res){
//   res.render('pages/dota/FAQ', { user: req.user});
// });

app.get('/dota/thank-you-signup', ensureRealm, ensureAuthenticated, function(req, res){
  res.render('pages/dota/thank-you-signup', { user: req.user, realm: req.session.realm});
});

// //butter
app.get('/blog', ensureRealm, renderHome)
app.get('/blog/p/:page', ensureRealm, renderHome)
app.get('/blog/:slug', ensureRealm, renderPost)

//Steam login route
// app.get(loginRouteDota.logout.route, loginRouteDota.logout.handler);
// app.get(loginRouteDota.steamReturn.route, passport.authenticate('steam', { failureRedirect: '/dota' }), loginRouteDota.steamReturn.handler);
// app.get(loginRouteDota.steamAuth.route, passport.authenticate('steam', { failureRedirect: '/dota' }), loginRouteDota.steamAuth.handler);




//==========LoL Routes==========
app.get('/lol', ensureRealm, function(req, res) {
  if(req.user && (req.user['Status'] == 'Not Registered' || req.user['Discord Id'] == null)){
    // console.log(req.user['Status']);
    res.redirect('/logout');
  }
  else if((req.user && req.user['Status'] != 'Not Registered' && !req.user['lol']) || !req.user) {
    res.redirect('/lol/signup');
  }
  else{
    var message = req.session.message;
    req.session.message = null;
    res.render('pages/lol/home', { user: req.user, message: message, realm: req.session.realm});
  }
});

// app.get('/lol/about', ensureRealm, function(req, res){
//   res.render('pages/lol/about', { user: req.user});
// });

app.get('/lol/rules', ensureRealm, function(req, res){
  res.render('pages/lol/rules', { user: req.user});
});

app.get('/lol/schedule', ensureRealm, function(req, res){
  res.render('pages/lol/schedule', { user: req.user});
});

app.get('/lol/FAQ', ensureRealm, function(req, res){
  res.render('pages/lol/FAQ', { user: req.user});
});

app.get('/lol/thank-you-signup', ensureRealm, ensureAuthenticated, function(req, res){
  res.render('pages/lol/thank-you-signup', { user: req.user, realm: req.session.realm});
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
  res.redirect('/auth/discord');
}

function ensureRealm(req, res, next) {
  // console.log(req.originalUrl);
  if(req.originalUrl.includes("dota/quickLink")){
     var query = url.parse(req.url,true).query;
     req.session.quickLinkId = query.id;
     req.session.realm = "dota/quickLink";
     // console.log(req.session.realm);
     return next();
  }
  else if(req.originalUrl.includes("dota")){
    req.session.realm = "dota";
    // console.log(req.session.realm);
    return next();
  }
  else if(req.originalUrl.includes("lol")){
    req.session.realm = "lol";
    // console.log(req.session.realm);
    return next();
  }
  else{
    // console.log("unknown");
    return next();
  }
}


//Butter display
function renderHome(req, res) {
  var page = req.params.page || 1;

  butter.post.list({page_size: 10, page: page}).then(function(resp) {
    res.render('pages/blog', {
      user: req.user,
      posts: resp.data.data,
      next_page: resp.data.meta.next_page,
      previous_page: resp.data.meta.previous_page,
      realm: req.session.realm
    })
  })
}

function renderPost(req, res) {
  var slug = req.params.slug;

  butter.post.retrieve(slug).then(function(resp) {
    res.render('pages/post', {
      user: req.user,
      title: resp.data.data.title,
      post: resp.data.data,
      published: new Date(resp.data.data.published),
      realm: req.session.realm
    })
  })
}


//Error handling
//Handle 404
app.use(function(req, res) {
  res.status(404)
  res.render('pages/error', {errorMessage: "404: Page not Found"});
  //.send('404: Page not Found');
});

// Handle 500
app.use(function(error, req, res, next) {
  res.status(500)
  res.render('pages/error', {errorMessage: "500: Internal Server Error"});
  //.send('500: Internal Server Error');
});
