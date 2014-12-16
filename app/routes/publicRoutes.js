var db            = require('../../db.js');

exports.index = function index(req,res) {
  db.query('SELECT * FROM protests', function(err, dbRes) {
      res.render('index', { user: req.user, protests: dbRes.rows });
    });
};