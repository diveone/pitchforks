// CONFIGURE REQUIREMENTS
var express         = require('express'),
    ejs             = require('ejs'),
    db              = require('./db.js'), // Currently inaccessible to handlers.js - Why?
    app             = express(),
    env             = process.env.NODE_ENV || 'development',
    path            = require('path'), // Currently inaccessible to handlers.js - Why?
    packageJson     = require('./package.json'),
    request         = require('request'),
    oauth           = require('oauth'),
    bodyParser      = require('body-parser'),
    cookieParser    = require('cookie-parser'),
    session         = require('express-session'),
    LocalStrategy   = require('passport-local').Strategy,
    passport        = require('passport'),
    methodOverride  = require('method-override'),
    util            = require('util'),
    TwitterStrategy = require('passport-twitter').Strategy,
    port            = process.env['PORT'] || 8000;

// ===================================================================
// CONFIGURE APP
// ===================================================================

global.App = {
  app: express(),
  port: port,
  version: packageJson.version,
  root: path.join(__dirname, '.'),
  appPath: function(path) {
    return this.root + '/' + path;
  },
  require: function(path) {
    return require(this.appPath(path));
  },
  env: env,
  start: function() {
    if (!this.started) {
      this.started = true;
      this.app.listen(this.port);
      console.log("Running App Version " + App.version + " on port " + App.port + " in " + App.env + " mode");
    }
  },
  route: function(path) {
    return this.require("routes/" + path);
  }
}

// ===================================================================
// CONFIGURE MIDDLEWARE
// ===================================================================

App.app.set('view engine', 'ejs');
App.app.use(express.static(__dirname + '/public'));
App.app.use(methodOverride('_method'));
App.app.use(bodyParser.json());
App.app.use(bodyParser.urlencoded({'extended':true}));
App.app.use(session({
  secret: 'milk and cookies',
  cookie: { maxAge: 300000 },
  resave: false,
  saveUninitialized: true
}));
App.app.use(passport.initialize());
App.app.use(passport.session());

App.require("routes/routes")(App.app);

// ===================================================================
// PASSPORT AUTHENTICATION
// ===================================================================

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.query('SELECT * FROM users WHERE id = $1', [id], function(err, dbRes) {
    if (!err) { done(err, dbRes.rows[0]); }
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

// VERIFY AUTHENTICATION
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

// ===================================================================
// TWITTER CONFIGURATION
// ===================================================================
var OAuth   = require('oauth').OAuth;

var oa      = new OAuth(
  "https://api.twitter.com/oauth/request_token",
  "https://api.twitter.com/oauth/access_token",
  "SHojLsO5Xo0ab3GoLvAX2Kefg",
  "PIbEX0KAi60QbBhPe1ilEhcybt6OpgpFsIwbwb3M6I5Eb1vDtD",
  "1.0",
  "http://localhost:8000/auth/twitter/callback",
  "HMAC-SHA1"
);

var TWITTER_CONSUMER_KEY = "SHojLsO5Xo0ab3GoLvAX2Kefg";
var TWITTER_CONSUMER_SECRET = "PIbEX0KAi60QbBhPe1ilEhcybt6OpgpFsIwbwb3M6I5Eb1vDtD";

passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://localhost:8000/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Twitter profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Twitter account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));