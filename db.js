// SETUP DB, LOCALHOST AND HEROKU
var db = {};
var pg = require('pg');
var config = require('./config/env.js');
var env = config[process.env.NODE_ENV];

db.config = {
  database: env.dbName,
  port: 5432,
  host: env.dbHost,
  user: env.dbUser,
  password: env.dbPwd
};

db.connect = function(runAfterConnecting) {
  pg.connect(db.config, function(err, client, done){
    if (err) {
      console.error("OOOPS!!! SOMETHING WENT WRONG!", err);
    }
    runAfterConnecting(client);
    done();
  });
};

// LOCALHOST AND HEROKU
db.query = function(statement, params, callback){
  db.connect(function(client){
    client.query(statement, params, callback);
  });
};

// HEROKU
// db.config = {}

// db.connect = function(runAfterConnecting) {
//   console.log(process.env.DATABASE_URL);
//
//   pg.connect(process.env.DATABASE_URL, function(err, client, done){
//     if (err) {
//       console.error("OOOPS!!! SOMETHING WENT WRONG!", err);
//     }
//     runAfterConnecting(client);
//     done();
//   });
// };

module.exports = db;
