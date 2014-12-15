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
    db            = require('./db.js');
    app           = express(),
    twitterAPI 		= require('node-twitter-api'),
    port          = process.env['PORT'] || 7000;

// CONFIGURATION
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

// Configure Twitter authentication
// var twitter = new twitterAPI({
//     consumerKey: 'SHojLsO5Xo0ab3GoLvAX2Kefg',
//     consumerSecret: 'PIbEX0KAi60QbBhPe1ilEhcybt6OpgpFsIwbwb3M6I5Eb1vDtD',
//     callback: 'http://localhost:7000'
// });

// twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results){
//     if (error) {
//         console.log("Error getting OAuth request token : " + error);
//     } else {
//         //store token and tokenSecret somewhere, you'll need them later; redirect user
//     }
// });

// twitter.getAccessToken(requestToken, requestTokenSecret, oauth_verifier, function(error, accessToken, accessTokenSecret, results) {
//     if (error) {
//         console.log(error);
//     } else {
//         //store accessToken and accessTokenSecret somewhere (associated to the user)
//         //Step 4: Verify Credentials belongs here
//     }
// });

// twitter.verifyCredentials(accessToken, accessTokenSecret, function(error, data, response) {
//     if (error) {
//         //something was wrong with either accessToken or accessTokenSecret
//         //start over with Step 1
//     } else {
//         //accessToken and accessTokenSecret can now be used to make api-calls (not yet implemented)
//         //data contains the user-data described in the official Twitter-API-docs
//         //you could e.g. display his screen_name
//         console.log(data["screen_name"]);
//     }
// });

// ROUTES: ALL USERS =================================================
app.get('/', function(req,res) {
  res.render('index', { user: req.user });
});

app.get('/login', function(req,res) {
  res.render('login', { user: req.user });
});

app.get('/signup', function(req,res) {
  res.render('signup', { user: req.user });
});

// Navbar search form
app.get('/results', function(req,res) {
  var params = req.query['search'];
  request('https://api.twitter.com/1.1/search/tweets.json?q=%23' + params, function(error, response, body) {
    var protests = JSON.parse(body);
    console.log(protests);
    res.render('results', { user: req.user, protests: protests });
  });
});

// User sign-up submission with redirect to login form.
app.post('/signup', function(req,res) {
  var registration = [req.body.username, req.body.email, req.body.password];
  db.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3)", registration, function(err, dbRes) {
    if(!err) {
      res.redirect('/login');
    }
  });
});

// User login authentication with redirect to homepage
app.post('/login', passport.authenticate('local', 
  {failureRedirect: 'login'}), function(req, res) {
    res.redirect('/');
});

// User logout
app.get('/logout', function(req,res) {
  res.render('index', { user: req.user });
});

app.delete('/logout', function(req, res) {
  req.logout();
  res.redirect('index');
});

// ROUTES: REGISTERED USERS ====================================================

app.get('/profile', function(req,res) {
	var user = req.user;
	if (user) {
  	res.render('user/profile', { user: user });
	} else {
		res.send('You must be logged in.');
	}
});

// ROUTES: Organizers