var app	= require('./application'),
	db = require('./db.js'),
	port = process.env.PORT || 8000,
  node_env = process.env.NODE_ENV,
	config = require('./config/env.js');

// PORT
app.listen(port, function() {
  console.log("Running Pitchforks in %s on port %s ", node_env, port);
	console.log("Process Host: %s", config[process.env.NODE_ENV].host);
});
