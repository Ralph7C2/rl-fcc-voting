var pollController = require('../app/controllers/poll.controller.js');
var express = require('express');
var router = express.Router();

router.post('/vote', function(req, res) {
	pollController.vote(req.body.pollId, (req.body.userId==='IP'?req.ip:req.body.userId), req.body.opt, req.body.newOpt).then(function(votedOption) {
		console.log("Vote success, then");
		if(req.body.newOpt === votedOption) {
			res.json({'success' : 'Voted', 'option' : votedOption, 'usedNew' : true});
		} else {
			res.json({'success' : 'Voted', 'option': votedOption});
		}
	}).fail(function() {
		console.log("Vote fail, fail");
		console.log(req.body);
		res.json({'failure' : 'Failed'});
	});
});

router.post('/deletePoll', function(req, res) {
	pollController.remove(req.body.pollId, req.body.userId).then(function() {
		res.json({ 'success' : 'Poll deleted', 'pollId' : req.body.pollId });
	}).fail(function() {
		res.json({ 'fail' : 'Poll not deleted'});
	});
});


module.exports = router;
