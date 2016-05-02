function testServer () {
  var app	= require('./application'),
  db = require('./db.js'),
  port = process.env.PORT || 8000,
  node_env = process.env.NODE_ENV,
  config = require('./config/env.js');
  env = config[process.env.NODE_ENV];

  // PORT
  app.listen(port, function() {
    console.log("Running Pitchforks in %s on port %s ", node_env, port);
    console.log("Process Host: %s", env.host);
  });
}

module.exports = testServer;
