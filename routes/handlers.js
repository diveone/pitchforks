// Declare DB, since won't work from application.js
var db = require('../db.js');
var passport      = require('passport');

// **********************
// PUBLIC ROUTE HANDLERS
// **********************

// Homepage
exports.index = function index(req,res) {
  db.query('SELECT * FROM protests', function(err, dbRes) {
      res.render('index', { user: req.user, protests: dbRes.rows });
    });
};

// Login
exports.login = function login(req,res) {
  res.render('login', { user: req.user });
};

// Sign-up for Pitchforks
exports.signup = function signup(req,res) {
	res.render('signup', { user: req.user });
};

// Navbar search form 
exports.results = function results(req,res) {
	var params = req.query['search'];
  request('https://api.twitter.com/1.1/search/tweets.json?q=%23' + params, 
  	function(error, response, body) {
    	var protests = JSON.parse(body);
    	console.log(protests);
    	res.render('results', { user: req.user, protests: protests });
  });
};

// View selected protest 
exports.show = function results(req,res) {
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

exports.addSignup = function addSignup(req,res) {
	var registration = [req.body.username, req.body.email, req.body.password];
  db.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3)", registration, function(err, dbRes) {
    if(!err) {
      res.redirect('/login');
      // How to write successRedirect and successFlash?
    }
  });
};

exports.userLogin =  function userLogin(req,res) {
	passport.authenticate('local', {failureflash: 'Try again.'}),
	function(req,res) { res.redirect('/'); }
};