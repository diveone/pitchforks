
module.exports = function(app) {
	//PUBLICLY ACCESSIBLE ROUTES
	var publicRoutes = App.route('handlers');
	app.get('/'							, publicRoutes.index);
	app.get('/login'				, publicRoutes.login);
	app.get('/signup'				, publicRoutes.signup);
	app.get('protests/:id'	, publicRoutes.show);

	// TWITTER NAVBAR SEARCH
	app.get('/results'			, publicRoutes.results);

	// FORMS
	app.post('/signup'			, publicRoutes.addSignup);
	app.post('/login'				, publicRoutes.userLogin);
	app.delete('/logout'		, publicRoutes.logout);

	// USERS ONLY -- AUTHORIZATION REQUIRED
	app.get('/edit'					, publicRoutes.editPage);
	app.patch('users/:id'		,	publicRoutes.editUser);

	app.get('/protests'			, publicRoutes.newProtest);
	app.post('/submit'			, publicRoutes.addProtest);
	app.get('/protests/edit', publicRoutes.editProtest);
	app.patch('/protests/:id',publicRoutes.updateProtest);

	// TWITTER AUTHENTICATION
	app.get('/twitter'							, publicRoutes.twitter);
	app.post('/twitter'							, publicRoutes.addTwitter);
	app.get('/auth/twitter'					, publicRoutes.authTwitter);
	app.get('/auth/twitter/callback', publicRoutes.authCallback);

}