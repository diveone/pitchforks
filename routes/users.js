var express           = require('express'),
    bcrypt            = require('bcrypt-nodejs'),
    passport          = require('passport'),
    db                = require('../db.js'),
    router            = express.Router();
var defaultAvatar = 'default.jpg';

// HOME
router.get('/', function(req, res) {
  res.render('index', { title: 'Users' });
});

// VERIFY AUTHENTICATION
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("User authentication successful.");
    return next(); }
  res.redirect('/login');
}
router.use('/', ensureAuthenticated)
// ===================================================================
// ROUTES: REGISTERED USER PAGES - ENSURE AUTHENTICATED
// ===================================================================

// User Profile
router.get(['/profile', '/:id'], function(req, res) {
  db.query("SELECT * FROM protests WHERE submitted_by = $1", [req.user.id], function(err, dbRes) {
    if(!err) {
      res.render('users/profile', { user: req.user, protests: dbRes.rows });
    }
  });
});

// Edit user form
router.get('/edit', function(req,res) {
  var user = req.user;
  res.render('users/edit', { user: user });
});

// Submit edits
router.patch('/:id', function(req, res) {
  var userData = [req.body.username, req.body.email, req.body.location, req.body.avatar, req.params.id];
  db.query("UPDATE users SET username = $1, email = $2, location = $3, avatar = $4 WHERE id = $5", userData, function(err, dbRes) {
    if (!err) {
      res.redirect('/users/profile');
    } else {
      console.log(err);
    }
  });
});

module.exports = router;
