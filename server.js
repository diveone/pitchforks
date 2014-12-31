var app 	= require('./application'),
		port 	= process.env.PORT || 8000;

// PORT
app.listen(port, function() {
  console.log("Running Pitchforks on port " + port);
});