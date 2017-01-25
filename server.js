require('dotenv').load();
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');

mongoose.connect(configDB.url);
mongoose.Promise = global.Promise;
require('./config/passport')(passport);

app.use(function(req, res, next) {
	console.log("First use");
	next();
});

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended : true}));

app.set('view engine', 'ejs');

//for passport
app.use(session({secret : 'keyboard cat'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/api', require('./api/routes.js'));

require('./app/routes.js')(app, passport);

app.listen(port);
console.log("Ready to rock on port "+port);