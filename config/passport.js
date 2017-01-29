var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../app/models/user');

module.exports = function(passport) {
	
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
	
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});
	
	
	passport.use('local-signup', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true 
	},
	function(req, email, password, done) {
		
		process.nextTick(function() {
			User.findOne({ 'local.email' : email }, function(err, user) {
				if(err) return done(err);
				if(user) {
					return done(null, false, req.flash('signupMessage', 'That email is already taken'));
				} else {
					var newUser = new User();
					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);
					
					newUser.save(function(err) {
						if(err)
							throw err;
						return done(null, newUser);
					});
				}
				
			});
		});
	}));

	passport.use('local-login', new LocalStrategy({
		usernameField : 'email',
		passportField : 'passport',
		passReqToCallback : true
	}, function(req, email, password, done) {
		User.findOne({ 'local.email' : email }, function(err, user) {
			if(err) return done(err);
			
			if(!user) return done(null, false, req.flash('loginMessage', 'User or password is incorrect.'));
			
			if(!user.validPassword(password)) return done(null, false, req.flash('loginMessage', 'User or password is incorrect.'));
			console.log("Login success");
			return done(null, user);
		});
	}));
	
	passport.use(new TwitterStrategy({
		consumerKey: process.env.TWITTER_CONSUMER_KEY,
		consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
		callbackURL: "https://rl-fcc-voting.herokuapp.com/auth/twitter/callback"
	},
	function(token, tokenSecret, profile, cb) {
		User.findOrCreate({twitterId : profile.id}, function(err, user) {
			return cb(err, user);
		});
	}));
};