// CONFIGURE VARIABLES
// ===================================================
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
    logger          = require('morgan'),
    flash           = require('flash'),
    // TwitterStrategy = require('passport-twitter').Strategy,
    port            = process.env['PORT'] || 8000;

// ROUTE VARS
var routes  = require('./routes/index');
var users   = require('./routes/users');

// ===================================================================
// CONFIGURE MIDDLEWARE
// ===================================================================

app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.use(logger('dev'));
app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':true}));
app.use(session({
  secret: 'milk and cookies',
  cookie: { maxAge: 300000 },
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
// app.use(function(req, res, next) {  
//   req.flash('error', 'This is a test.');    
//   next();
// });
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/users', users);
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
  // "http://pitchforks.herokuapp.com/auth/twitter/callback",
  "http://localhost:8000/auth/twitter/callback",
  "HMAC-SHA1"
);

//*************************************************
// ERROR HANDLING
//=================================================

// 404
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// DEVELOPMENT -- STACKTRACE
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// PRODUCTION -- NO STACKTRACE
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;