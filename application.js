// CONFIGURE VARIABLES
// ===================================================
require('./config/env.js');
var express         = require('express'),
    // ejs             = require('ejs'),
    db              = require('./db.js'),
    app             = express(),
    env             = app.get('env'),
    path            = require('path'),
    packageJson     = require('./package.json'),
    request         = require('request'),
    oauth           = require('oauth'),
    bodyParser      = require('body-parser'),
    // cookieParser    = require('cookie-parser'),
    cookieSession   = require('cookie-session'),
    session         = require('express-session'),
    bcrypt          = require('bcrypt-nodejs'),
    LocalStrategy   = require('passport-local').Strategy,
    passport        = require('passport'),
    methodOverride  = require('method-override'),
    logger          = require('morgan'),
    flash           = require('flash'),
    port            = process.env['PORT'] || 8000;

// ROUTE VARS
var routes  = require('./routes/index');
var users   = require('./routes/users');
var protests = require('./routes/protests');
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
// app.use(cookieParser({secret: process.env.secret}))
app.use(cookieSession({secret: process.env.secret}));
app.use(session({
  secret: process.env.secret,
  cookie: { secure: true, maxAge: 300000 },
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
// app.use(function(req, res, next) {
//   req.flash('error', 'This is a test.');
//   next();
// });

// AUTHENTICATION
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/users', users);
// app.use('/users', ensureAuthenticated);
app.use('/protests', protests);
// app.use('/protests', ensureAuthenticated);
// ===================================================================
// PASSPORT AUTHENTICATION
// ===================================================================

passport.serializeUser(function(user, done) {
  console.log("Serialize user: %s", user.username);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.query('SELECT * FROM citizen WHERE id = $1', [id], function(err, dbRes) {
    console.log("Deserialize user: %s", id);
    if (!err) { done(err, dbRes.rows[0]); }
  });
});

var localStrategy = new LocalStrategy(
  function(username, password, done) {
    db.query('SELECT * FROM citizen WHERE username = $1', [username], function(err, dbRes) {
      if (err) {
        console.error(err);
        return done(err);
      };
      console.log('User query success: %s', dbRes.rows[0].username)
      var user = dbRes.rows[0];

      if (!user.username) {
        console.error("Username not found: %s", username);
        return done(null, fase, { message: "User #{username} not found."});
      }
      bcrypt.compare(password, user.password, function(err, res) {
        console.log("Checking password match: %s", res)
        if (res == false) {
          console.error("Password invalid: %s", password);
          return done(null, false, { message: 'Invalid password.' });
        }
        console.log("Logging in user: %s", user.id);
        return done(null, user);
      });
    });
  }
);

passport.use(localStrategy);

// VERIFY AUTHENTICATION
// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     console.log("User authentication successful.");
//     return next(); }
//   res.redirect('/login');
// }

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
