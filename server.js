const express = require('express');
require('dotenv').load();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');

const githubStrategy = require('passport-github').Strategy;
passport.use(new githubStrategy({
	clientID: process.env.GITHUB_CLIENT_ID,
	clientSecret: process.env.GITHUB_CLIENT_SECRET,
	callbackURL: process.env.GITHUB_CLIENT_CALLBACK_URL
},
function(accessToken, refreshToken, profile, cb) {
	User.findOrCreate({gihubId: profile.id }, function(err, user) {
		return cb(err, user)
	});
}));

var app = express();

app.get('/', express.static('public'));

app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', {failureRedirect: '/login'}),
	function(req, res) {
		res.redirect('/');
	}
);

var port = process.env.PORT || 4040;
app.listen(port, function() {
	console.log("Listening on port "+port);
}); 