const express = require('express');

var app = express();

app.get('/', function(req, res) {
	res.send("Hello world!");
});

var port = process.env.PORT || 4040;
app.listen(port, () => {
	console.log("Listening on port "+port);
});