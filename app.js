// ===================================================================
// CONFIGURATION
// ===================================================================
var express       = require('express'),
    ejs           = require('ejs'),
    path          = require('path'),
    request    		= require('request'),
    oauth 				= require('oauth'),
    bodyParser    = require('body-parser'),
    cookieParser  = require('cookie-parser'),
    session       = require('express-session'),
    LocalStrategy = require('passport-local').Strategy,
    passport      = require('passport'),
    methodOverride= require('method-override'),
    db            = require('./db.js'),
    flash         = require('connect-flash'),
    app           = express(),
    util          = require('util'),
    TwitterStrategy = require('passport-twitter').Strategy,
    port          = process.env['PORT'] || 8000;

var OAuth= require('oauth').OAuth;

var oa = new OAuth(
  "https://api.twitter.com/oauth/request_token",
  "https://api.twitter.com/oauth/access_token",
  "SHojLsO5Xo0ab3GoLvAX2Kefg",
  "PIbEX0KAi60QbBhPe1ilEhcybt6OpgpFsIwbwb3M6I5Eb1vDtD",
  "1.0",
  "http://pitchforks.herokuapp.com/auth/twitter/callback",
  "HMAC-SHA1"
);

// ===================================================================
// MODULE SET-UP
// ===================================================================
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':true}));
app.use(session({
  secret: 'milk and cookies',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// PORT
app.listen(port, function() {
  console.log("CHOO CHOO!");
});

// AUTHENTICATION
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.query('SELECT * FROM users WHERE id = $1', [id], function(err, dbRes) {
    if (!err) {
      done(err, dbRes.rows[0]);
    }
  });
});

var localStrategy = new LocalStrategy(
  function(username, password, done) {
    db.query('SELECT * FROM users WHERE username = $1', [username], function(err, dbRes) {
      var user = dbRes.rows[0];
      console.log(username);

      console.log(user);

      if (err) { return done(err); }
      if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
      if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
      return done(null, user);
    })
  }
);

passport.use(localStrategy);

// USE TO AUTHENTICATE RESTRICTED ACCESS

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

// ===================================================================
// ROUTES: PUBLIC - ALL USERS
// ===================================================================

// Homepage
app.get('/', function(req, res) {
    db.query('SELECT * FROM protests', function(err, dbRes) {
      res.render('index', { user: req.user, protests: dbRes.rows });
    });   
});

// About
app.get('/about', function(req, res) {
    db.query('SELECT * FROM protests', function(err, dbRes) {
      res.render('about', { user: req.user, protests: dbRes.rows });
    });   
});

// Login Link
app.get('/login', function(req,res) {
  res.render('login', { user: req.user });
});

// Sign-up Link
app.get('/signup', function(req,res) {
  res.render('signup', { user: req.user });
});

// Navbar Search Form
app.get('/results', function(req,res) {
  var params = req.query['search'];
  db.query('SELECT * FROM protests WHERE location ~* $1 OR name ~* $1', [params], function(err,dbRes) {
    res.render('results', { user: req.user, protests: dbRes.rows, search: params });
  });
});

// View Specific Protest
app.get('/protests/:id', function(req, res) {
  db.query("SELECT * FROM protests WHERE event_id = $1", [req.params.id], function(err, dbRes) {
    if(!err) {
      res.render('show', { user: req.user, protest: dbRes.rows[0] });
    }
  });
});

// ===================================================================
// ROUTES: FORMS
// ===================================================================

// User Sign-up Form
app.post('/signup', function(req,res) {
  var registration = [req.body.username, req.body.email, req.body.loc, req.body.avatar, req.body.password];
  db.query("INSERT INTO users (username, email, location, avatar, password) VALUES ($1, $2, $3, $4, $5)", registration, function(err, dbRes) {
    if(!err) {
      res.redirect('/login');
      // How to write successRedirect and successFlash?
    }
  });
});

// User Login Form
app.post('/login', passport.authenticate('local', 
  {failureRedirect: 'login' }), function(req, res) {
    res.redirect('/');
});

// User Logout Link
app.get('/logout', function(req, res){
  // Destroy session, logout
  req.session.destroy(function(){
    res.redirect('/');
  });
});

// ===================================================================
// ROUTES: REGISTERED USER PAGES - ENSURE AUTHENTICATED
// ===================================================================

// User Profile
app.get('/profile', ensureAuthenticated, function(req, res) {
  var user = req.user;
  db.query("SELECT name FROM protests WHERE submitted_by = $1", [req.user.id], function(err, dbRes) {
    if(!err) {
      res.render('users/profile', { user: user, protests: dbRes.rows });
    }
    console.log(err);
  });
});

// Edit user form
app.get('/users/edit', ensureAuthenticated, function(req,res) {
	var user = req.user;
  res.render('users/edit', { user: user });
});

// Submit edits -- Needs Authentication, url id to req.user.id
app.patch('/users/:id', function(req, res) {
	var userData = [req.body.username, req.body.email, req.body.location, req.body.avatar, req.params.id];
	db.query("UPDATE users SET username = $1, email = $2, location = $3, avatar = $4 WHERE id = $5", userData, function(err, dbRes) {
		if (!err) {
			res.redirect('/profile');
		} else {
      console.log(err);
    }
	});
});

// View selected user profile
app.get('/users/:id', ensureAuthenticated, function(req, res) {
	db.query("SELECT * FROM users WHERE id = $1", [req.params.id], function(err, dbRes) {
		if(!err) {
			res.render('users/show', { user: dbRes.rows[0] });
		}
	});
});

// ===================================================================
// ROUTES: PROTESTS - ENSURE AUTHENTICATED
// ===================================================================

// If logged in, create new protest.
app.get('/protests', ensureAuthenticated, function(req,res) {
	var user = req.user;
  res.render('protests/new', { user: user });
});

// Submit protest form
app.post('/protests', function(req,res) {
  var protestData = [req.body.name, req.body.date, req.body.description, req.body.location, req.user.id];
  db.query("INSERT INTO protests (name, date, description, location, submitted_by) VALUES ($1, $2, $3, $4, $5)", protestData, function(err, dbRes) {
    if(!err) {
      res.redirect('/');
      // Needs redirect to the protest submitted
    }
  });
});

// COMING SOON - Participate - No redirect? How?
app.post('/participate', function(req,res) {
  var protester = [req.user.id, req.protests.event_id];
  db.query("INSERT INTO users_protests (id, event_id) VALUES ($1, $2)", protester, function(err, dbRes) {
    if(!err) {
      res.redirect('/');
      // Needs redirect to the protest submitted
    }
  });
});

// Edit a protest page
app.get('/protests/:id/edit', ensureAuthenticated, function(req,res) {
	db.query('SELECT * FROM protests WHERE event_id = $1', [req.params.id], function(err, dbRes) {
    if (!err) {
      res.render('protests/edit', { user: req.user, protest: dbRes.rows[0] });
    }
  });
});

// Submit protest edit form
app.patch('/protests/:id', function(req, res) {
	var protestData = [req.body.name, req.body.date, req.body.description, req.body.location, req.params.id];
	db.query("UPDATE protests SET name = $1, date = $2, description = $3, location = $4 WHERE event_id = $5", protestData, function(err, dbRes) {
		if (!err) {
			res.redirect('/protests/'+req.params.id);
		}
	});
});

// ===================================================================
// TWITTER AUTHENTICATION: http://moonlitscript.com/post.cfm/how-to-use-oauth-and-twitter-in-your-node-js-expressjs-app/
// ===================================================================
app.get('/auth/twitter', function(req, res){
  oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
    if (error) {
      console.log(error);
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
});

// Make variable available globally
var userResults;

app.get('/auth/twitter/callback', function(req,res) {
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
        console.log("OAuth Results: "+ results, req.session.oauth);
        // Modify global variable
        userResults = [results.user_id, results.screen_name];
        console.log(userResults);
        res.render("twitter", { user: req.user });
      }
    });
  } else {
    res.send("you're not supposed to be here.");
  }
});

// Twitter redirect page
app.get('/twitter', function(req,res) {
  res.render('twitter', { user: req.user });
});

// Pitchforks form from Twitter redirect
app.post('/twitter', function(req,res) {
  // Use global userResults from OAuth to submit Twitter data
  var params = [userResults[0],userResults[1], req.body.email, req.body.password];
  db.query('INSERT INTO users (twitter_id, username, email, password) VALUES ($1, $2, $3, $4)', params, function(err,dbRes) {
    console.log(params);
    console.log(err);
    console.log(dbRes);
    res.render("login", { user: req.user } );
  });
});