var Poll = require('../models/poll');
var Q = require('q');
service = {};

service.createPoll = function(req, res) {
	newPoll = new Poll();
	newPoll.title = req.body.title;
	newPoll.createdBy = req.user._id;
	newPoll.description = req.body.desc;
	var optCount = 1;
	while(true) {
		var optName = "opt"+optCount;
		if(!req.body[optName]) break;
		newPoll.options.push({opt : req.body[optName], count : 0});
		optCount++;
	}
	newPoll.save(function(err) {
		if(err) return res.send(err);
		res.redirect('/');
	});
};

service.updatePoll = function(req, res) {
	service.getPollById(req.params.id).then(function(poll) {
		poll.title = req.body.title;
		poll.description = req.body.desc;
		var optCount = 1;
		while(true) {
			var optName = "optName"+optCount;
			if(!req.body[optName]) break;
				if(newPoll.options[optCount-1]) {
					newPoll.options[optCount-1].opt = req.body[optName];
				} else {
					newPoll.options.push({opt : req.body[optName], count : 0});
				}
				optCount++;
		}
		poll.save(function(err) {
			if(err) return res.send(err);
			res.redirect('/viewPoll/'+req.params.id);
		});
	});
};

service.loadPolls = function(cb) {
	Poll.find(function(err, polls) {
		console.log("Loaded Polls");
		console.log(polls);
		cb(polls);
	});
};

service.loadPollsByUser = function(user) {
	var deferred = Q.defer();
	Poll.find({'createdBy' : user._id}, function(err, polls) {
		if(err) deferred.reject(err);
		if(polls) {
			console.log("Found polls, resolving");
			deferred.resolve(polls);
		} else {
			console.log("No polls found, resolving");
			deferred.resolve();
		}
	});
	return deferred.promise;
}

service.getPollById = function(id) {
	var deferred = Q.defer();
  console.log("Looking for poll ID "+id);
	Poll.findOne({_id : id}, function(err, poll) {
		console.log("Found: ");
		console.log(poll);
		if(err) deferred.reject(err);
		if(poll) {
			deferred.resolve(poll);
		} else {
			console.log("Resolving Q");
			deferred.reject();
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

service.remove = function(pollId, userId) {
	var deferred = Q.defer();
	
	Poll.remove({_id : pollId, createdBy : userId}, function(err) {
		if(err) deferred.reject();
		else deferred.resolve();
	});
	
	return deferred.promise;
};

module.exports = service;