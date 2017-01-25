var pollController = require('../app/controllers/poll.controller.js');
var express = require('express');
var router = express.Router();

router.post('/vote', function(req, res) {
	pollController.vote(req.body.pollId, (req.body.userId==='IP'?req.ip:req.body.userId), req.body.opt).then(function(votedOption) {
		console.log("Vote success, then");
		res.json({'success' : 'Voted', 'option': votedOption});
	}).fail(function() {
		console.log("Vote fail, fail");
		console.log(req.body);
		res.json({'failure' : 'Fialed'});
	});
});


module.exports = router;
