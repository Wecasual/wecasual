"use strict";
var express = require('express');
var mongodb = require('mongodb');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');



var ObjectId = require('mongodb').ObjectId;
var uri = process.env.MONGODB_URI;
var app = express();
app.set('port', (process.env.PORT || 5000));

//==========Middleware==========

//Static path for CSS
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//Session middleware
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))

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

//==========End Middleware==========

app.get('/', function(req, res) {
	let error = req.session.error;
	req.session.error = null;
	let message = req.session.message;
	req.session.message = null;
	if(error){
		res.render('pages/index', {error: error});
	}
	else if(message){
		res.render('pages/index', {message: message});
	}
	else{
		res.render('pages/index');
	}
});

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
		let newEmail = {email: req.body.email};
		mongodb.MongoClient.connect(uri, function (err, db) {
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

//Comment
