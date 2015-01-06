// Declare, since won't work from application.js
var db            = require('../db.js');
var passport      = require('passport');

// VERIFY AUTHENTICATION
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

// **********************
// PUBLIC ROUTE HANDLERS
// **********************

// Homepage
exports.index = function index(req,res) {
  db.query('SELECT * FROM protests', function(err, dbRes) {
      res.render('index', { user: req.user, protests: dbRes.rows });
    });
};

// About
exports.about = function about(req,res) {
  db.query('SELECT * FROM protests', function(err, dbRes) {
      res.render('about', { user: req.user, protests: dbRes.rows });
    });
};

// Login Link
exports.login = function login(req,res) {
  res.render('login', { user: req.user });
};

// Sign-up Link
exports.signup = function signup(req,res) {
	res.render('signup', { user: req.user });
};

// Navbar Search Form 
exports.results = function results(req,res) {
	var params = req.query['search'];
  db.query('SELECT * FROM protests WHERE location ~* $1 OR name ~* $1', [params], function(err,dbRes) {
    res.render('results', { user: req.user, protests: dbRes.rows, search: params });
  });
};

// View Selected Protest 
exports.viewProtest = function viewProtest(req,res) {
	db.query("SELECT * FROM protests WHERE event_id = $1", [req.params.id], 
		function(err, dbRes) {
    	if(!err) {
    	  res.render('show', { user: req.user, protest: dbRes.rows[0] });
    	}
  });
};

// **********************
// FORM HANDLERS
// **********************

// SIGN-UP FORM
exports.addSignup = function addSignup(req,res) {
	var registration = [req.body.username, req.body.email, req.body.loc, req.body.avatar, req.body.password];
  db.query("INSERT INTO users (username, email, location, avatar, password) VALUES ($1, $2, $3, $4, $5)", registration, function(err, dbRes) {
    if(!err) {
      res.redirect('/login');
      // How to write successRedirect and successFlash?
    }
  });
};

// 1.LOGIN NOT LOADING -- 2. STORE COOKIE IN DB?
exports.userLogin =  function userLogin(req,res) {
	passport.authenticate('local', {failureRedirect: 'login'}),
	function(err,dbRes) { res.redirect('index'); }
};

// LOGOUT LINK
exports.logout = function logout(req,res) {
  req.session.destroy(function(){
    res.redirect('/');
  });
};

// ************************************
// USERS ONLY -- REQUIRES AUTHORIZATION
// ************************************

// /users/:id - VIEW A USER
exports.viewUser = function viewUser(req,res) {
  ensureAuthenticated();
  db.query('SELECT * FROM users WHERE id = $1', [req.params.id], function(err,dbRes) {
    res.render('users/show', { user: dbRes.rows[0] });
  });
};

// VIEW YOUR PROFILE
exports.uprofile = function uprofile(req,res) {
  ensureAuthenticated();
  db.query("SELECT * FROM users WHERE id = $1", [req.params.id], function(err, dbRes) {
    if(!err) {
      res.render('users/profile', { user: dbRes.rows[0] });
    }
  });
};

// EDIT USER FORM - TEST
exports.editUserForm = function editUserForm(req,res) {
  res.render('users/edit', { user: req.user });
};

// EDIT USER DB UPDATE - TEST
exports.editUser = function editUser(req,res) {
  var userData = [req.body.username, req.body.email, req.body.location, req.body.avatar, req.params.id];
  db.query("UPDATE users SET username = $1, email = $2, location = $3, avatar = $4 WHERE id = $5", userData, function(err, dbRes) {
    if (!err) {
      res.redirect('/profile');
    } else {
      console.log(err);
    }
  });
};

// *************************************************
// PROTEST ORGANIZERS ONLY -- REQUIRES AUTHORIZATION
// *************************************************

// ADD PROTEST FORM - ***AUTHENTICATE** - TEST 
exports.newProtest = function newProtest(req,res) {
  var user = req.user;
  if (user) {
    ensureAuthenticated;
    res.render('protests/new', { user: user });
  } else {
    res.render('login');
  }
};

// PROTEST DB INSERT - TEST 
exports.addProtest = function addProtest(req,res) {
  var protestData = [req.body.name, req.body.date, req.body.description, req.body.location, req.user.id];
  db.query("INSERT INTO protests (name, date, description, location, submitted_by) VALUES ($1, $2, $3, $4, $5)", protestData, function(err, dbRes) {
    if(!err) {
      res.redirect('/');
      // Needs redirect to the protest submitted
    }
  });
}

// EDIT PROTEST FORM - ***AUTHENTICATE*** - TEST 
exports.editProtestForm = function editProtestForm(req,res) {
  ensureAuthenticated;
  db.query('SELECT * FROM protests WHERE event_id = $1', [req.params.id], function(err, dbRes) {
    if (!err) {      
      res.render('protests/edit', { user: req.user, protest: dbRes.rows[0] });
    }
  });
};

// PROTEST DB UPDATE - TEST 
exports.updateProtest = function updateProtest(req,res) {
  var protestData = [req.body.name, req.body.date, req.body.description, req.body.location, req.params.id];
  db.query("UPDATE protests SET name = $1, date = $2, description = $3, location = $4 WHERE event_id = $5", protestData, function(err, dbRes) {
    if (!err) {
      res.redirect('/protests/'+req.params.id);
    }
  });
};

// ************************************
// TWITTER AUTHENTICATION 
// ************************************
// Source: Moonlitscript.com
// URL: http://bit.ly/1uUMdaV

// TWITTER SIGN-IN
exports.twitter = function twitter(req,res) {
  res.render('twitter', { user: req.user });
};

// TWITTER: REQUEST TOKEN
exports.authTwitter = function authTwitter(req,res) {
  oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
    if (error) {
      console.log(error);
      res.send("yeah no. didn't work.")
    }
    else {
      req.session.oauth = {};
      req.session.oauth.token = oauth_token;
      console.log('oauth.token: ' + req.session.oauth.token);
      req.session.oauth.token_secret = oauth_token_secret;
      console.log('oauth.token_secret: ' + req.session.oauth.token_secret);
      res.redirect('https://twitter.com/oauth/authenticate?oauth_token='+oauth_token)
    }
  });
};

// TWITTER: AUTH CALLBACK
var userResults; // Make variable available to other functions

exports.authCallback = function authCallback(req,res) {
  if (req.session.oauth) {
    req.session.oauth.verifier = req.query.oauth_verifier;
    var oauth = req.session.oauth;

    oa.getOAuthAccessToken(oauth.token,oauth.token_secret,oauth.verifier, 
    function(error, oauth_access_token, oauth_access_token_secret, results){
      if (error){
        console.log(error);
        res.send("yeah something broke.");
      } else {
        req.session.oauth.access_token = oauth_access_token;
        req.session.oauth.access_token_secret = oauth_access_token_secret;        
        console.log(results);
        userResults = [results.user_id, results.screen_name];
        console.log(userResults);
        res.render("twitter", { user: req.user });
      }
    });
  } else {
    res.send("you're not supposed to be here.");
  }
};

// TWITTER USER TO DB
exports.addTwitter = function addTwitter(req,res) {
  var params = [userResults[0],userResults[1], req.body.email, req.body.password];
  db.query('INSERT INTO users (twitter_id, username, email, password) VALUES ($1, $2, $3, $4)', params, function(err,dbRes) {
    console.log(params);
    res.render("login", { user: req.user } );
  });
};