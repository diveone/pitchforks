var request  = require('supertest');
var db       = require('../db.js');

console.log('%s - %s', process.env.NODE_ENV, db.config.database)
describe("Route Specs - ", function() {
  describe("public routes - ", function() {
    var req = request('http://localhost:8000/');

    beforeAll(function() {
      var citizen = ['Testor', 'testor@example.com', 'password', 'Testville', 'TV'];
      db.query('INSERT INTO citizen (username, email, password, city, state) VALUES ($1, $2, $3, $4, $5)', citizen, function(err, dbRes) {
        if (err) {
          return new Error("SPEC ERROR: %s", err);
        }
      });

      var protest = ['Test Protest', 'This is a test protest',  '2015-04-18', citizen.id, 'Testville', 'TV'];
      db.query('INSERT INTO protest (name, description, date, submitted_by, city, state) VALUES ($1, $2, $3, $4, $5, $6)', protest, function(err, dbRes) {
        if (err) {
          return new Error("SPEC ERROR : %s", err);
        }
      })
    });

    it("/index returns 200", function(){
      req.get('/').expect(200, function(err) {
        console.log('SPEC ERROR: %s', err);
      });
    });

    it("/index lists protests on homepage", function(){
      req.get('/').expect(hasProtests).end();

      function hasProtests(res) {
        console.log('SPEC RESPONSE CONTENT: %s', res.body)
        expect(res.body).toContain('Current Protests');
      }
    });

    it("/protest displays new form", function() {
      req.get('/protests/submit').expect(200, function(err) {
        return new Error("SPEC ERROR: %s", err)
      });
    });

    it("/protest/:id displays a protest", function() {
      req.get('/protest/1').expect(200, function(err) {
        console.log("SPEC ERROR: %s", err);
      });
    });

    it("/results displays search results", function() {
      req.get('/results').send({search: "protest"})
    });
  });
});
