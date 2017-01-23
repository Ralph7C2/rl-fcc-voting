var Poll = require('../models/poll');

service = {};

service.createPoll = function(req, res) {
	newPoll = new Poll();
	newPoll.title = req.body.title;
	newPoll.createdBy = req.user._id;
	var optCount = 1;
	while(true) {
		var optName = "opt"+optCount;
		if(!req.body[optName]) break;
		newPoll.options.push({opt : req.body[optName], count: 0});
		optCount++;
	}
	newPoll.save(function(err) {
		if(err) return res.send(err);
		res.redirect('/');
	});
};

service.loadPolls = function(cb) {
	Poll.find(function(err, polls) {
		console.log("Loaded Polls");
		console.log(polls);
		cb(polls);
	});
};

service.getPollById = function(id, cb) {
	Poll.findOne({_id : id}, function(err, poll) {
		console.log(poll);
		if(err) return res.send(err);
		cb(poll);
	});
};

service.vote = function(req, res) {
	Poll.findOne({_id : req.params.id}, function(err, poll) {
		var options = poll.options;
		options[parseInt(req.body.voteOpt)].count++;
		Poll.findOneAndUpdate({_id : req.params.id}, { options : options }, function(err, poll) {
			res.send("Voted on "+poll.options[parseInt(req.body.voteOpt)].opt+" in poll "+poll.title);
		});
	});
};

module.exports = service;