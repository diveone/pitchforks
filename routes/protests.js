var express           = require('express'),
    request           = require('request'),
    bcrypt            = require('bcrypt-nodejs'),
    passport          = require('passport'),
    db                = require('../db.js'),
    router            = express.Router();
var defaultAvatar = 'default.jpg';

// VERIFY AUTHENTICATION
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

router.use('/', ensureAuthenticated)
// ===================================================================
// ROUTES: PROTESTS - ENSURE AUTHENTICATED
// ===================================================================

// If logged in, create new protest.
router.get('/protests', function(req,res) {
	var user = req.user;
  res.render('protests/new', { user: user });
});

// Submit protest form
router.post('/protests', function(req,res) {
  var protestData = [req.body.name, req.body.date, req.body.description, req.body.location, req.user.id];
  db.query("INSERT INTO protest (name, date, description, location, submitted_by) VALUES ($1, $2, $3, $4, $5)", protestData, function(err, dbRes) {
    if(!err) {
      res.redirect('/');
      // Needs redirect to the protest submitted
    }
  });
});

// COMING SOON - Participate - No redirect? How?
router.post('/participate', function(req,res) {
  var protester = [req.user.id, req.protests.event_id];
  db.query("INSERT INTO users_protests (id, event_id) VALUES ($1, $2)", protester, function(err, dbRes) {
    if(!err) {
      res.redirect('/protests/'+ req.params.id);
      // Needs redirect to the protest submitted
    }
  });
});

// Fist Pump (Going to AJAX)
router.post('/pump', function(req,res) {
  var protest = [req.protests.event_id, req.protests.support];
  db.query("UPDATE protest SET support = $2 WHERE event_id = $1", protest, function(err, dbRes) {
    if(err) {
      console.log(err);
    }
  });
});

// Edit a protest page
router.get('/protests/:id/edit', function(req,res) {
	db.query('SELECT * FROM protest WHERE event_id = $1', [req.params.id], function(err, dbRes) {
    if (!err) {
      res.render('protests/edit', { user: req.user, protest: dbRes.rows[0] });
    }
  });
});

// Submit protest edit form
router.patch('/protests/:id', function(req, res) {
	var protestData = [req.body.name, req.body.date, req.body.description, req.body.location, req.params.id];
	db.query("UPDATE protest SET name = $1, date = $2, description = $3, location = $4 WHERE event_id = $5", protestData, function(err, dbRes) {
		if (!err) {
			res.redirect('/'+ [req.params.id] );
		}
	});
});

module.exports = router
