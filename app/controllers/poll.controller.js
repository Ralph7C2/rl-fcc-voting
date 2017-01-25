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
		if(err) deferred.reject(err);
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
	
	service.getPollById(pollId).then(function(poll) {
		if(poll) {
			var voterFound = false;
			poll.voters.forEach(function(voter) {
				if(voter.voterId === user) {
					console.log("Voter found");
					voterFound = true;
					deferred.reject();
					console.log("Past resolve!");
				}
			});
			if(voterFound) return;
			console.log("Beyond voter forEach loop!");
			var options = poll.options;
			console.log(options);
			options[parseInt(opt)].count++;
			console.log(options);
			Poll.findOneAndUpdate({"_id" : pollId}, { options : options }, function(err, poll) {
				if(err) console.log(err)
				console.log(poll);
			});
			poll.voters.push({voterId : user});
			poll.save();
			deferred.resolve(options[parseInt(opt)].opt);
		} else {
			deferred.reject();
		}
	});
	return deferred.promise;
};

module.exports = service;