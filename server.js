const express = require('express');
const dotenv = require('dotenv').load();
var app = express();

app.get('/', function(req, res) {
	res.send("Hello world!");
});

var port = process.env.PORT || 4040;
app.listen(port, function() {
	console.log("Listening on port "+port);
}); 