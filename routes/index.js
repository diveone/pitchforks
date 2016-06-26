var express           = require('express'),
    request           = require('request'),
    bcrypt            = require('bcrypt-nodejs'),
    passport          = require('passport'),
    db                = require('../db.js'),
    router            = express.Router(),
    fs                = require('fs');
var defaultAvatar     = 'default.jpg';

// TWITTER OAUTH VARIABLES
var OAuth = require('oauth').OAuth;
var twitterOauthRequest = process.env.twitterOauthRequest
var twitterOauthAccess = process.env.twitterOauthAccess
var twitterOauthCallback = process.env.host + process.env.twitterOauthCallback
var twitterAuth = process.env.twitterAuth

var oa = new OAuth(
  twitterOauthRequest,
  twitterOauthAccess,
  process.env.twitterKey,
  process.env.twitterSecret,
  "1.0",
  twitterOauthCallback,
  "HMAC-SHA1"
);

router.post('/report-violation', function(req, res) {
    console.log("VIOLATION REPORT: %s", req.body);
    fs.writeFile("./logs/", req.body, function(err) {
        if (err) {
            errors = new Error("Log not written: %s", err);
            console.log(errors);
        }
        console.log("Violation report saved.")
    });
    res.redirect('/');
});

// ===================================================================
// ROUTES: PUBLIC - ALL USERS
// ===================================================================

// Homepage
router.get('/', function(req, res) {
    console.log(process.env.host)
    db.query('SELECT * FROM protests', function(err, dbRes) {
      res.render('index', { title: 'Pitchforks', user: req.user, protests: dbRes.rows });
    });
});

// About
router.get('/about', function(req, res) {
    db.query('SELECT * FROM protests', function(err, dbRes) {
      res.render('about', { user: req.user, protests: dbRes.rows });
    });
});

// Login Link
router.get('/login', function(req,res) {
  res.render('login', { user: req.user, csrftoken: req.csrfToken() });
});

// Sign-up Link
router.get('/signup', function(req,res) {
  res.render('signup', { user: req.user });
});

// Navbar Search Form
router.get('/results', function(req,res) {
  var params = req.query['search'];
  db.query('SELECT * FROM protests WHERE city ~* $1 OR state ~* $1 OR name ~* $1', [params], function(err,dbRes) {
    res.render('results', { user: req.user, protests: dbRes.rows, search: params });
  });
});

// View Specific Protest
router.get('/protest/:id', function(req, res) {
  db.query("SELECT * FROM protests WHERE event_id = $1", [req.params.id], function(err, dbRes) {
    if(!err) {
      res.render('show', { user: req.user, protest: dbRes.rows[0] });
    }
  });
});
// News Search API
router.get('/news'), function(req, res) {
  console.log("Check for a pulse ...")
  var title = document.getElementsByClassName('event-title');
  request('http://api.feedzilla.com/v1/articles/search.json?q=' + encodeURIComponent(title.innerHTML), function(error, response, body) {
    var articles = JSON.parse(body);
    console.log(articles);
    res.render('show', { articles: articles });
  });
}
// ===================================================================
// ROUTES: FORMS
// ===================================================================

// User Sign-up Form
router.post('/signup', function(req,res) {
  console.log("Sign-up requested: %s", req.body.username);
  var salt = bcrypt.genSaltSync();
  console.log("Salt created: %s", salt);
  bcrypt.hash(req.body.password, salt, null, function(err, hash) {
    console.log("Hash created: %s", hash);
	   // Store hash and salt in your password DB.
     var registration = [req.body.username, req.body.email, req.body.loc, defaultAvatar, hash, salt];
     var user;
     db.query("INSERT INTO citizens (username, email, location, avatar, password, salt) VALUES ($1, $2, $3, $4, $5, $6)", registration, function(err, dbRes) {
       if (err) { console.error(err); }
       console.log("User saved: %s", dbRes.rows[0]);

       db.query("SELECT * FROM citizens WHERE username = $1", [req.body.username], function(err, dbRes) {
         if(err) { console.log(err); }
         user = dbRes.rows[0];
         console.log("User created: %s", user.username);

         req.user = user;
         req.session.user = user.id;
       })
     });
     req.login(user, function(err) {
       console.log("Redirecting user: %s", req.user)
       res.redirect('/');
     })
   });
});

// User Login Form
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: 'login',
  failureFlash: 'Incorrect credentials.'}),
  function(req, res) {
    res.redirect('/');
});

// User Logout Link
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
  // req.session.destroy(function(){
  //   res.redirect('/');
  // });
});

module.exports = router;
