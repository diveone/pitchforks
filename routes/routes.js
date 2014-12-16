
module.exports = function(app) {
	//PUBLICLY ACCESSIBLE ROUTES
	var publicRoutes = App.route('handlers');
	app.get('/'							, publicRoutes.index);
	app.get('/login'				, publicRoutes.login);
	app.get('/signup'				, publicRoutes.signup);
	app.get('protests/:id'	, publicRoutes.show);

	// TWITTER NAVBAR SEARCH
	app.get('/results', publicRoutes.results);

	// FORMS
	app.post('/signup'			, publicRoutes.addSignup);
	app.post('/login'				, publicRoutes.userLogin);

}