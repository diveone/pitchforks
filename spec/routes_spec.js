var request  = require('supertest');
var db       = require('../db.js');
var config = require('../config/env.js');
var env = config[process.env.NODE_ENV]
var server;
var Factory = require('./factories.js');

console.log('ENV: %s - DB: %s', process.env.NODE_ENV, env.dbName);
console.log('TEST proces.env: %s', process.env.dbName);

describe("Route Specs - ", function() {
  describe("public routes - ", function() {
    // var req = request(server);

    beforeAll(function() {
      var citizenData = ['Testor', 'testor@example.com', 'password', 'Testville', 'TV'];
      var protestData = ['Test Protest', 'This is a test protest',  '2015-04-18', citizenData.id, 'Testville', 'TV'];

      console.log("SPEC DB QUERY...");
    });

    beforeEach(function() {
      server = require('./server.js');
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
      request(server)
        .get('/results')
        .send({search: "protest"})
        .expect(function(res) {
          res.body.protests.name = "Test Protest"
        })
    });
  });
});
