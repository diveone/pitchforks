var request  = require('supertest');
var db       = require('../db.js');
var config = require('../config/env.js');
var util = require('util');
var env = config.testing;
var server;
var chai = require('chai'),
    expect = chai.expect,
    should = chai.should(),
    assert = chai.assert;
var citizen, protest;
var Factory = require('./models.js');
// Testing utilities
var u = require('./utils.js');

console.log('ENV: TEST - DB: %s - PORT: %s', env.dbName, env.port);

describe("Route Specs - ", function() {
    describe("public routes - ", function() {
        var citizenData = [u.randomUser(), u.randomEmail(), 'password', 'Testville, TX', '1'];
        var protestData = ['Test Default Protest', 'This is a test protest', '2015-04-18', '1', 'Testville', 'TX'];

        before(function() {
            server = require('./server')();
            citizen = Factory.citizen.add(citizenData);
            protest = Factory.protest.add(protestData);
            // done();
        });
        after(function(done) {
            Factory.clear.citizens();
            Factory.clear.protests();
            server.close()
            done();
        });

        it("/index returns 200", function(done) {
            request(server)
                .get('/')
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    done();
                });
        });

        it("/protest displays new form", function(done) {
            request(server)
                .get('/protests/submit')
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    done();
                });
        });

        it("/protest/:id displays a protest", function(done) {
            request(server)
                .get('/protest/1')
                .expect(200, {
                    name: "Test Protest"
                })
                .end(function(err, res) {
                    if (err) return done(err);
                    done();
                });
        });

        it("/results displays search results", function(done) {
            request(server)
                .get('/results')
                .send({search: "protest"})
                .expect(200, {
                    name: "Test Protest"
                })
                .end(function(err, res) {
                    if (err) return done(err);
                    done();
                });
        });
  });
});
