module.exports = function(app) {
  // PUBLICLY ACCESSIBLE ROUTES
  var publicRoutes = App.route('publicRoutes');
  app.get('/',  publicRoutes.index);
  app.get('/login', publicRoutes.login);
  app.get('/signup', publicRoutes.signup);
  app.get('/results', publicRoutes.results);
  app.get('/protests/:id', publicRoutes.show);

  // SIGN-UP, LOGIN, LOGOUT
  var userRoutes = App.route('userRoutes');
  app.post('/signup', userRoutes.login);
  app.post('/login', publicRoutes.index);
}