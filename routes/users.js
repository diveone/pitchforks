var express = require('express'),
    request = require('request'),
    LocalStrategy     = require('passport-local').Strategy,
    passport          = require('passport'),
    router  = express.Router();

// HOME
router.get('/', function(req, res) {
  res.render('index', { title: 'Earful' });
});

// VERIFY AUTHENTICATION
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

// ===================================================================
// ROUTES: REGISTERED USER PAGES - ENSURE AUTHENTICATED
// ===================================================================

// User Profile
router.get('/profile', ensureAuthenticated, function(req, res) {
  db.query("SELECT * FROM protests WHERE submitted_by = $1", [req.user.id], function(err, dbRes) {
    if(!err) {
      res.render('users/profile', { user: req.user, protests: dbRes.rows });
    }
  });
});

// Edit user form
router.get('/users/edit', ensureAuthenticated, function(req,res) {
  var user = req.user;
  res.render('users/edit', { user: user });
});

// Submit edits -- Needs Authentication, url id to req.user.id
router.patch('/users/:id', function(req, res) {
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
router.get('/users/:id', ensureAuthenticated, function(req, res) {
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
router.get('/protests', ensureAuthenticated, function(req,res) {
  var user = req.user;
  res.render('protests/new', { user: user });
});

// Submit protest form
router.post('/protests', function(req,res) {
  var protestData = [req.body.name, req.body.date, req.body.description, req.body.location, req.user.id];
  db.query("INSERT INTO protests (name, date, description, location, submitted_by) VALUES ($1, $2, $3, $4, $5)", protestData, function(err, dbRes) {
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

// Edit a protest page
router.get('/protests/:id/edit', ensureAuthenticated, function(req,res) {
  db.query('SELECT * FROM protests WHERE event_id = $1', [req.params.id], function(err, dbRes) {
    if (!err) {
      res.render('protests/edit', { user: req.user, protest: dbRes.rows[0] });
    }
  });
});

// Submit protest edit form
router.patch('/protests/:id', function(req, res) {
  var protestData = [req.body.name, req.body.date, req.body.description, req.body.location, req.params.id];
  db.query("UPDATE protests SET name = $1, date = $2, description = $3, location = $4 WHERE event_id = $5", protestData, function(err, dbRes) {
    if (!err) {
      res.redirect('protests/'+ [req.params.id] );
    }
  });
});

module.exports = router;