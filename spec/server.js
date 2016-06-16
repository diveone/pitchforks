function testServer () {
    var app	= require('../application'),
        config = require('../config/env.js'),
        node_env = 'testing',
        env = config[node_env],
        port = env.TEST_PORT || 7000,
        db = require('../db.js');

    db.config.database = 'pitchforks_test'
  // PORT
    var server = app.listen(port, function() {
        console.log("Running Pitchforks Test in %s on port %s ", node_env, port);
    });

    return server;
}

module.exports = testServer;
