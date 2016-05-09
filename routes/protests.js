var express           = require('express'),
    // request           = require('request'),
    bcrypt            = require('bcrypt-nodejs'),
    passport          = require('passport'),
    db                = require('../db.js'),
    router            = express.Router();
var defaultAvatar = 'default.jpg';

// VERIFY AUTHENTICATION
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("User authentication successsful!")
    return next();
  }
  res.redirect('/login');
}

router.use('/', ensureAuthenticated)
// ===================================================================
// ROUTES: PROTESTS - ENSURE AUTHENTICATED
// ===================================================================

// If logged in, create new protest.
router.get('/submit', function(req,res) {
	var user = req.user;
  console.log("PROTEST SUBMISSION USER: %s", user.username);
  res.render('protests/new', { user: user, csrftoken: req.csrfToken() });
});

// Submit protest form
router.post('/submit', function(req,res) {
  var protestData = [req.body.name, req.body.date, req.body.description, req.body.city, req.body.state, req.user.id];
  db.query("INSERT INTO protests (name, date, description, city, state, submitted_by) VALUES ($1, $2, $3, $4, $5, $6)", protestData, function(err, dbRes) {
    if(!err) {
      // console.log('PROTESTS POST DB: %s', dbRes.rows[0])
      // var protest = dbRes.rows[0]
      res.redirect('/');
      // Needs redirect to the protest submitted
    } else {
      console.log('PROTEST POST DB ERROR: %s', err)
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
  db.query("UPDATE protests SET support = $2 WHERE event_id = $1", protest, function(err, dbRes) {
    if(err) {
      console.log(err);
    }
  });
});

// Edit a protest page
router.get('/:id/edit', function(req,res) {
	db.query('SELECT * FROM protests WHERE event_id = $1', [req.params.id], function(err, dbRes) {
    if (!err) {
      res.render('protests/edit', { user: req.user, protest: dbRes.rows[0] });
    }
  });
});

// Submit protest edit form
router.patch('/:id', function(req, res) {
	var protestData = [req.body.name, req.body.date, req.body.description, req.body.location, req.params.id];
	db.query("UPDATE protests SET name = $1, date = $2, description = $3, location = $4 WHERE event_id = $5", protestData, function(err, dbRes) {
		if (!err) {
			res.redirect('/'+ [req.params.id] );
		}
	});
});

module.exports = router
