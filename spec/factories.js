var db = require('../db.js');
var exports = module.exports = {}

exports.citizen = function(data) {
  db.query('INSERT INTO citizens (username, email, password, city, state) VALUES ($1, $2, $3, $4, $5)', data, function(err, dbRes) {
    if (err) {
      return new Error("SPEC ERROR: %s", err);
    }
    console.log("SPEC DB RESULT: %s", dbRes)
  });
}

exports.protest = function(data) {
  db.query('INSERT INTO protests (name, description, date, submitted_by, city, state) VALUES ($1, $2, $3, $4, $5, $6)', data, function(err, dbRes) {
    if (err) {
      return new Error("SPEC ERROR : %s", err);
    }
  })
}
