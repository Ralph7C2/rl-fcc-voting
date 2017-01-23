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
}

module.exports = service;