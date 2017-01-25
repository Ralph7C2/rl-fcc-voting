var Poll = require('../models/poll');
var Q = require('q');
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

service.getPollById = function(id) {
	var deferred = Q.defer();
  
	Poll.findOne({_id : id}, function(err, poll) {
		if(err) deferred.eject(err);
		if(poll) {
			deferred.resolve(poll);
		} else {
			deferred.resolve();
		}
	});
	return deferred.promise;
};

service.vote = function(pollId, user, opt) {
	var deferred = Q.defer();
	
	var thePoll;
	
	Poll.findOne({_id : pollId}, function(err, poll) {
		if(err) deferred.reject(err);
		thePoll = poll;
		Poll.findOne({'voters.voterId' : user}, function(err, vote) {
			console.log("Found Voter");
			success=false;
		});
		if(!success) {
			return;
		}
		var options = poll.options;
		options[parseInt(opt)].count++;
		Poll.findOneAndUpdate({_id : pollId}, { options : options }, function(err, poll) {
			poll.voters.push({voterId : user});
			poll.save();
		});
	});
	return success;
};

module.exports = service;