"use strict";
var express = require('express');
var mongodb = require('mongodb');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
var passportSteam = require('passport-steam');
var url = require('url');
var pg = require('pg');
const pgParams = url.parse(process.env.DATABASE_URL || 'postgres://mdbmqyhxoghdju:4a974026b7af90957de377fcc1952f2f1b406e1ff4110176fb0937f6f3a36cb2@ec2-184-73-189-221.compute-1.amazonaws.com:5432/da56qf31hm82e5');
const pgAuth = pgParams.auth.split(':');
const config = {
  user: pgAuth[0],
  password: pgAuth[1],
  host: pgParams.hostname,
  port: pgParams.port,
  database: pgParams.pathname.split('/')[1],
  ssl: true
};

var pool = new pg.Pool(config);
var profiles = require('./repos/profiles');


//Mongodb
var ObjectId = require('mongodb').ObjectId;
//Can't use the .env mongodb uri because it is undefined for some reason. Worked before 4/9/2017, now it doesn't
const MONGO_URI = 'mongodb://heroku_ht4hl31j:9voqfjcq47cr9tlg7l07isp4po@ds157873.mlab.com:57873/heroku_ht4hl31j';//process.env.MONGODB_URI;


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
    pool.connect(function(err, client) {
        if(err){
          Alert("Error connecting to database");
          client.end();
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
