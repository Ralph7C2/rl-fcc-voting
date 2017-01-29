var Poll = require('../models/poll');
var Q = require('q');
service = {};

service.createPoll = function(req, pass, fail) {
	newPoll = new Poll();
	if(req.body.title.trim().length===0) {
		return fail('Title cannot be empty');
	}
	newPoll.title = req.body.title;
	newPoll.createdBy = req.user._id;
	newPoll.description = req.body.desc;
	var includedOpts = [];
	for(var i = 1;i<=parseInt(req.body.numOpts);i++) {
		var optName = "opt"+i;
		if(!req.body[optName]) continue;
		req.body[optName] = req.body[optName].trim();
		console.log(optName+" is not empty");
		if(includedOpts.indexOf(req.body[optName])!=-1) return fail('Cannot have two of the same option!');
		newPoll.options.push({opt : req.body[optName], count : 0});
		includedOpts.push(req.body[optName]);
	}
	if(newPoll.options.length < 2) {
		console.log(newPoll.options.length);
		return fail('Must have at least 2 non-empty option');
	}
	newPoll.save(function(err, poll) {
		if(err) return fail(err);
		pass(poll._id);
	});
};

service.loadPolls = function(cb) {
	Poll.find(function(err, polls) {
		cb(polls);
	});
};

service.loadPollsByUser = function(user) {
	var deferred = Q.defer();
	Poll.find({'createdBy' : user._id}, function(err, polls) {
		if(err) deferred.reject(err);
		if(polls) {
			deferred.resolve(polls);
		} else {
			deferred.resolve();
		}
	});
	return deferred.promise;
}

service.getPollById = function(id) {
	var deferred = Q.defer();
  Poll.findOne({_id : id}, function(err, poll) {
		if(err) deferred.reject(err);
		if(poll) {
			deferred.resolve(poll);
		} else {
			deferred.reject();
		}
	});
	return deferred.promise;
};

service.vote = function(pollId, user, opt, newOpt) {
	var deferred = Q.defer();
	
	service.getPollById(pollId).then(function(poll) {
		if(poll) {
			var voterFound = false;
			poll.voters.forEach(function(voter) {
				if(voter.voterId === user) {
					voterFound = true;
					deferred.reject();
				}
			});
			if(voterFound) return;
			var options = poll.options;
			if(parseInt(opt) == options.length) {
				options.push({opt : newOpt, count: 1});
			} else {
				options[parseInt(opt)].count++;
			
				Poll.findOneAndUpdate({"_id" : pollId}, { options : options }, function(err, poll) {
					if(err) console.log(err)
					console.log(poll);
				});
			}
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