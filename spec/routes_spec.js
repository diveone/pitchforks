var request  = require('supertest');
var db       = require('../db.js');
var config = require('../config/env.js');
var env = config.testing
var server;
var chai = require('chai'),
    expect = chai.expect,
    should = chai.should(),
    assert = chai.assert;
var citizen, protest, defaultCitizen, defaultProtest;
var Factory = require('./models.js');

console.log('ENV: TEST - DB: %s - PORT: %s', env.dbName, env.port);

function randomEmail() {
    var num = Math.floor(Math.random() * (10000 - 1) + 1);
    return ''.concat('citizen', num, '@example.com')
}

function randomUser() {
    var num = Math.floor(Math.random() * (10000 - 1) + 1);
    return ''.concat('citizen', num)
}

describe("Route Specs - ", function() {
    describe("public routes - ", function() {
        var citizenData = [randomUser(), randomEmail(), 'password', 'Testville, TV', '1'];
        var protestData = ['Test Default Protest', 'This is a test protest', '2015-04-18', citizenData.id, 'Testville', 'TV'];

        before(function() {
            server = require('./server')();
            citizen = Factory.citizen.add(citizenData);
            protest = Factory.protest.add(protestData);
        });
        after(function() {
            Factory.clear.citizens();
            Factory.clear.protests();
            server.close()
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

        it("/index lists protests on homepage", function(done){
            request(server).get('/')
                .expect(200)
                // .expect(function(res) {
                //     var protests = res.protests;
                //     expect(protests).to.have.length(1)
                //     assert.equal(protests[0].name, 'Test Default Protest')
                // })
                .end(function(err) {
                    if (err) return done(err);
                    done();
                });
        });

    it("/protest displays new form", function() {
      request(server).get('/protests/submit')
        .expect(200);
    });

    it("/protest/:id displays a protest", function() {
        request(server).get('/protest/1').
            expect(200);
    });

    it("/results displays search results", function() {
        request(server)
            .get('/results')
            .send({search: "protest"})
            .expect(200, {
                name: "Test Protest"
            })
    });
  });
});
