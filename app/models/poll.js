var mongoose = require('mongoose');

var voterSchema = new mongoose.Schema({
	voterId : String
});

var pollSchema = new mongoose.Schema({
	title : String,
	description : String,
	createdBy : String,
	options: [],
	voters : [voterSchema],
	comments: {
		comment : String,
		user : String
	}
});

module.exports = mongoose.model('Poll', pollSchema);