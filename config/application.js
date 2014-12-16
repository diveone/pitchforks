var express       = require('express'),
    ejs           = require('ejs'),
    env           = process.env.NODE_ENV || 'development',
    path          = require('path'),
    packageJson   = require('../package.json'),
    request       = require('request'),
    oauth         = require('oauth'),
    bodyParser    = require('body-parser'),
    cookieParser  = require('cookie-parser'),
    session       = require('express-session'),
    LocalStrategy = require('passport-local').Strategy,
    passport      = require('passport'),
    methodOverride= require('method-override'),
    db            = require('../db.js');
    app           = express(),
    util = require('util'),
    TwitterStrategy = require('passport-twitter').Strategy,
    // twitterAPI     = require('node-twitter-api'),
    // RedisStore    = require('connect-redis')(express),
    port          = process.env['PORT'] || 7000;

global.App = {
  app: express(),
  port: port,
  version: packageJson.version,
  root: path.join(__dirname, '..'),
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
    return this.require("app/routes/" + path);
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


App.require("config/routes")(App.app);