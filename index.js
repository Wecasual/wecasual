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
	var errors = req.session.errors;
	req.session.errors = null;
	var success = req.session.success;
	req.session.success = null;
	if(errors){
		res.render('pages/index', {errors: errors});
	}
	else if(success){
		res.render('pages/index', {success: success});
	}
	else{
		res.render('pages/index');
	}
});

app.post('/mailingList/add', function(req, res){
	req.checkBody('email', 'Enter your email').notEmpty();
	req.checkBody('email', 'Enter a correct email').isEmail();

	var errors = req.validationErrors();

	if(errors){
		req.session.errors = errors;
		res.redirect('/');
	}
	else{
		req.session.success = "You have been added to the mailing list";
		res.redirect('/');
	}
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
