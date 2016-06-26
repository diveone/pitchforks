var db = require('../db.js');

var dbModels = {
    citizen: {
        add: function(data) {
              db.query({
                  name: 'add citizen',
                  text: 'INSERT INTO citizens (username, email, password, location, twitter_id) VALUES ($1, $2, $3, $4, $5)',
                  values: data
              })
        },
        get: function(data) {
              db.query({
                  name: 'get citizen',
                  text: 'SELECT FROM citizens WHERE id=$1',
                  values: data
              })
        },
        update: function(data) {
            db.query({
                name: 'update citizen',
                text: "UPDATE citizens SET username = $1, email = $2, location = $3, avatar = $4 WHERE id = $5"
                values: data
            })
        }
    },
    protest: {
        add: function(data) {
            db.query({
                name: 'add protest',
                text: 'INSERT INTO protests (name, description, date, submitted_by, city, state) VALUES ($1, $2, $3, $4, $5, $6)',
                values: data
            })
        },
        get: function(data) {
              db.query({
                  name: 'get protest',
                  text: 'SELECT FROM citizens WHERE id=$1',
                  values: data
              })
        },
        update: function(data) {
            db.query({
                name: 'update protest',
                text: "UPDATE protests SET name = $1, description = $2, date = $3, city = $4, state = $5 WHERE id = $6"                values: data
            })
        }
    },
    clear: {
        citizens: function() {
            db.query({
                name: 'clear citizens',
                text: 'DELETE FROM citizens'
            })
        },
        protests: function() {
            db.query({
                name: 'clear protests',
                text: 'DELETE FROM protests'
            })
        }
    }
}

module.exports = dbModels;
