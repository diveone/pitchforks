var request  = require('supertest');
var db       = require('../db.js');
var config = require('../config/env.js');
var env = config[process.env.NODE_ENV]
var server;

console.log('ENV: %s - DB: %s', env, env.dbName)

describe("Route Specs - ", function() {
  describe("public routes - ", function() {
    // var req = request(server);

    beforeAll(function() {
      var citizen = ['Testor', 'testor@example.com', 'password', 'Testville', 'TV'];
      var protest = ['Test Protest', 'This is a test protest',  '2015-04-18', citizen.id, 'Testville', 'TV'];

      db.query('INSERT INTO citizens (username, email, password, city, state) VALUES ($1, $2, $3, $4, $5)', citizen, function(err, dbRes) {
        if (err) {
          return new Error("SPEC ERROR: %s", err);
        }
      });

      beforeEach(function() {
        server = require('./factories.js');
      })

      db.query('INSERT INTO protests (name, description, date, submitted_by, city, state) VALUES ($1, $2, $3, $4, $5, $6)', protest, function(err, dbRes) {
        if (err) {
          return new Error("SPEC ERROR : %s", err);
        }
      })
    });

    it("/index returns 200", function(){
      request(server).get('/').expect(200, function(err) {
        console.log('SPEC ERROR: %s', err);
      });
    });

    it("/index lists protests on homepage", function(){
      request(server).get('/').expect(hasProtests).end();

      function hasProtests(res) {
        console.log('SPEC RESPONSE CONTENT: %s', res.body)
        expect(res.body).toContain('Current Protests');
      }
    });

    it("/protest displays new form", function() {
      request(server).get('/protests/submit').expect(200, function(err) {
        return new Error("SPEC ERROR: %s", err)
      });
    });

    it("/protest/:id displays a protest", function() {
      request(server).get('/protest/1').expect(200, function(err) {
        console.log("SPEC ERROR: %s", err);
      });
    });

    it("/results displays search results", function() {
      request(server).get('/results').send({search: "protest"})
    });
  });
});
