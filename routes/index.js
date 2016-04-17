var express           = require('express'),
    request           = require('request'),
    bcrypt            = require('bcrypt-nodejs'),
    passport          = require('passport'),
    db                = require('../db.js'),
    router            = express.Router();
var defaultAvatar = 'default.jpg';

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
  res.render('login', { user: req.user });
});

// Sign-up Link
router.get('/signup', function(req,res) {
  res.render('signup', { user: req.user });
});

// Navbar Search Form
router.get('/results', function(req,res) {
  var params = req.query['search'];
  db.query('SELECT * FROM protests WHERE location ~* $1 OR name ~* $1', [params], function(err,dbRes) {
    res.render('results', { user: req.user, protests: dbRes.rows, search: params });
  });
});

// View Specific Protest
router.get('/protests/:id', function(req, res) {
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
     db.query("INSERT INTO users (username, email, location, avatar, password, salt) VALUES ($1, $2, $3, $4, $5, $6)", registration, function(err, dbRes) {
       if (err) { console.error(err); }
       console.log("User saved: %s", dbRes.rows[0]);

       db.query("SELECT * FROM users WHERE username = $1", [req.body.username], function(err, dbRes) {
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


/* ===================================================================
TWITTER AUTHENTICATION:
Step 1: Route users to twitter to authenticate.
Step 2: User returns with oath token and secret
Step 3: Send token to twitter to exchange for access token.
Step 4: Save access token for later use.
======================================================================*/
router.get('/auth/twitter', function(req, res){
  oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
    if (error) {
      console.log(error);
    } else {
      console.log("Oauth session created: %s", req.session)
      req.session.oauth = {}
      req.session.oauth.token = oauth_token;
      req.session.oauth.token_secret = oauth_token_secret;

      console.log('>>>> Oauth token: %s', req.session.oauth.token);
      console.log('>>>> Oauth results: user %s', results.screen_name);
      res.redirect(twitterAuth + oauth_token)
    }
  });
});

// Make variable available globally

router.get('/auth/twitter/callback', function(req,res) {
  var oauth = req.session.oauth;
  if (oauth) {
    oauth.verifier = req.query.oauth_verifier;

    oa.getOAuthAccessToken(oauth.token,oauth.token_secret,oauth.verifier,
    function(error, oauth_access_token, oauth_access_token_secret, results){
      if (error){
        console.log("Oauth access token error: %s", error);
      } else {
        oauth.access_token        = oauth_access_token;
        oauth.access_token_secret = oauth_access_token_secret;
        req.user.username         = results.screen_name;
        console.log("OAuth Results: "+ results.screen_name, oauth);
        // Modify global variable
        var userResults = [results.user_id, results.screen_name, oauth_access_token, oauth_access_token_secret];
        console.log(userResults);
        // Check for user in the DB

        // Insert user into database

        var user = req.user;
        db.query('INSERT INTO users (twitter_id, username, twitter_token,   twitter_secret) VALUES ($1, $2, $3, $4)', userResults, function(err,dbRes) {
          var user = dbRes.rows
          if (err) { return new Error(err); }
          console.log("Oauth token stored: %s", user)
          req.login(user, function(err, res) {
            if (err) { return new Error('Twitter login error: ' + err); }
            res.render('/', { user: req.user });
          })
        });

        // res.render("twitter", { user: req.user });
      }
    });
  } else {
    // 404 or other message
    res.send("Session not found.");
  }
});

// Twitter redirect page
router.get('/twitter', function(req,res) {
  if (req.session.oauth) {
    var user = req.user

  }
});

// Pitchforks form from Twitter redirect
router.post('/twitter', function(req,res) {
  // Use global userResults from OAuth to submit Twitter data
  var params = [userResults[0],userResults[1], req.body.email, req.body.password];
  db.query('INSERT INTO users (twitter_id, username, email, password) VALUES ($1, $2, $3, $4)', params, function(err,dbRes) {
    res.render("login", { user: req.user } );
  });
});

module.exports = router;
