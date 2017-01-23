var mongoose = require('mongoose');

var pollSchema = new mongoose.Schema({
	title : String,
	description : String,
	createdBy : String,
	options: [],
	comments: {
		comment : String,
		user : String
	}
});

module.exports = mongoose.model('Poll', pollSchema);