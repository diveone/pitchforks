// SETUP DB, LOCALHOST AND HEROKU
var db = {};
var pg = require('pg');

// LOCALHOST
db.config = {
  database: "pitchforks",
  port: 5432,
  host: "localhost",
  user: "postgres"
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

//   pg.connect(process.env.DATABASE_URL, function(err, client, done){
//     if (err) {
//       console.error("OOOPS!!! SOMETHING WENT WRONG!", err);
//     }
//     runAfterConnecting(client);
//     done();
//   });
// };


// Heroku DB Link
// postgres://jskkmojmrdkgwr:lfooOMVWDrT60HKMYCWxLW2VNV@ec2-54-163-250-41.compute-1.amazonaws.com:5432/d1028jfm8s0pe2

module.exports = db;