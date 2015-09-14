var app	= require('./application'),
	port = process.env.PORT || 8000,
    node_env = process.env.NODE_ENV = 'development';

// PORT
app.listen(port, function() {
  console.log("Running Pitchforks in %s on port %s ", node_env, port);
});
