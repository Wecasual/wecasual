"use strict";
var express = require('express');
var mongodb = require('mongodb');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
var passportSteam = require('passport-steam');

var ObjectId = require('mongodb').ObjectId;
const MONGO_URI = process.env.MONGODB_URI;
var app = express();
app.set('port', (process.env.PORT || 5000));

//==========Middleware==========

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
    returnURL: 'http://localhost:5000/auth/steam/return',
    realm: 'http://localhost:5000/',
    apiKey: '162FD43454D97C2E629FAE6026C4BD53'
  },
  function(identifier, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's Steam profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Steam account with a user record in your database,
      // and return that user instead.
      profile.identifier = identifier;
      return done(null, profile);
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
  res.render('pages/about');
});

//==========Steam login stuff==========
app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
});

app.get('/auth/steam',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    console.log('redirect');
    res.redirect('/');
});
//==========End steam login stuff==========

app.post('/mailingList/add', function(req, res){
	req.checkBody('email', 'Please enter your email address').notEmpty();
	req.checkBody('email', 'Please enter a valid email address').isEmail();

	let error = req.validationErrors();
	let message = null;
  console.log(MONGO_URI);

	if(error){
		req.session.error = error[0].msg;
		res.redirect('/');
	}
	else{
		let newEmail = {email: req.body.email};
		mongodb.MongoClient.connect(MONGO_URI, function (err, db) {
		    if(err){
		    	console.log(err, newEmail);
    			req.session.error = "Error adding to mailing list. Please try again later";
			   	db.close();
    			res.redirect('/');
		    }
		    else{
    			db.collection("mailing_list").findOne({"email": newEmail.email}, function(err, doc){
		    		if(err){
		    			console.log(err, newEmail);
		    			req.session.error = "Error adding to mailing list. Please try again later";
					   	db.close();
		    			res.redirect('/');
    				}
    				else{
    					if(!doc){
	    					db.collection("mailing_list").insertOne(newEmail, function(err, response){
					    		if(err){
					    			console.log(err, newEmail);
					    			req.session.error = "Error adding to mailing list. Please try again later";
								   	db.close();
					    			res.redirect('/');

					    		}
					    		else{
					    			console.log("Email Inserted");
					    			req.session.message = "You have been added to the mailing list";
								   	db.close();
					    			res.redirect('/');
					    		}
							});
    					}
    					else{
			    			console.log("The email entered is already in the mailing list", newEmail);
			    			req.session.error = "The email entered is already in the mailing list";
						   	db.close();
			    			res.redirect('/');
    					}
    				}
    			});

		    }
		});
	}
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}
