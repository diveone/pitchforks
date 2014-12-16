var express       = require('express'),
    ejs           = require('ejs'),
    db            = require('./db.js'),
    app           = express(),
    env           = process.env.NODE_ENV || 'development',
    path          = require('path'),
    packageJson   = require('./package.json'),
    request       = require('request'),
    oauth         = require('oauth'),
    bodyParser    = require('body-parser'),
    cookieParser  = require('cookie-parser'),
    session       = require('express-session'),
    LocalStrategy = require('passport-local').Strategy,
    passport      = require('passport'),
    methodOverride= require('method-override'),
    util          = require('util'),
    TwitterStrategy = require('passport-twitter').Strategy,
    port            = process.env['PORT'] || 8000;

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

// Middleware
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