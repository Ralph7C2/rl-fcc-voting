var pollController = require('../app/controllers/poll.controller.js');
var express = require('express');
var router = express.Router();

router.post('/vote', function(req, res) {
	if(pollController.vote(req.body.pollId, (req.body.userId==='IP'?req.ip:req.body.userId), req.body.opt)) {
		res.json({'success' : 'Voted'});
	} else {
		res.json({'failure' : 'Fialed'});
	}
});


module.exports = router;
