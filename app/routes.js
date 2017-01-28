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
		res.render('signup.ejs', {
			message : req.flash('signupMessage'),
			user : req.user
		});
	});
	
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/',
		failureRedirect : '/signup',
		failureFlash : true
	}));
	
	app.get('/profile', isLoggedIn, function(req, res) {
		console.log("/profile! Calling load polls by user");
		pollController.loadPollsByUser(req.user).then(function(polls) {
			console.log("THEN! rendering!");
			res.render('profile.ejs', {
				user: req.user,
				polls : polls
			});
		});
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
	
	app.get('/editPoll/:id', isLoggedIn, function(req, res) {
		console.log("Edit Poll "+req.params.id);
		pollController.getPollById(req.params.id).then(function(poll) {
			console.log("In THEN: ");
			console.log(poll);
			if(poll) {
				res.render('editPoll.ejs', {
					user : req.user,
					poll : poll,
					message : req.flash('editPoll')
				});
			} else {
				res.send("Hmm...I'm not sure what happened, but I cannot find that poll! <a href='/'>Go home?</a>");
			}
		}).fail(function() {
			console.log("In Fail: ");
			res.send("Hmm...I'm not sure what happened, but I cannot find that poll! <a href='/'>Go home?</a>");
		});
	});
	
	app.post('/editPoll/:id', isLoggedIn, pollController.updatePoll);
	
	function isLoggedIn(req, res, next) {
		if(req.isAuthenticated())
			return next();
		res.redirect('/');
	}
}