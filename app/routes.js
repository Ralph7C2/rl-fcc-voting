var pollController = require('./controllers/poll.controller.js');

module.exports = function(app, passport) {
	
	app.get('/', function(req, res) {
		pollController.loadPolls(function(polls) {
			res.render('index.ejs', {
			user : req.user,
			polls : polls
		});
		});
	});
	
	app.get('/login', function(req, res) {
		res.render('login.ejs', { message : req.flash('loginMessage') });
	});
	
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/',
		failureRedirect : '/login',
		failureFlash : true
	}));
	
	app.get('/signup', function(req, res) {
		res.render('signup.ejs', {message : req.flash('signupMessage')});
	});
	
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/',
		failureRedirect : '/signup',
		failureFlash : true
	}));
	
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user: req.user
		})
	});
	
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	
	app.get('/createPoll', isLoggedIn, function(req, res) {
		res.render('createPoll.ejs', {
			message : req.flash('createPollmessage'),
			user : req.user,
			polls : req.polls
		});
	});
	
	app.post('/createPoll', isLoggedIn, pollController.createPoll);
	
	app.get('/viewPoll/:id', function(req, res) {
		pollController.getPollById(req.params.id).then(function(poll) {
			if(poll) {
				res.render('viewPoll.ejs', {
					user : req.user,
					poll : poll
				});
			} else {
				res.send("Could not find poll!");
			}
		});
	});

	function isLoggedIn(req, res, next) {
		if(req.isAuthenticated())
			return next();
		res.redirect('/');
	}
}