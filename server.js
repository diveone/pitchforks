var app	= require('./application'),
	db = require('./db.js'),
	port = process.env.PORT || 8000,
  node_env = process.env.NODE_ENV;

app.configure('testing', function() {
	db.config.database = "pitchforks_test";
});

// PORT
app.listen(port, function() {
  console.log("Running Pitchforks in %s on port %s ", node_env, port);
	console.log("Process Host: %s", process.env.host)
});

module.exports.node_env = node_env;
