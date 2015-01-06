
module.exports = function(app) {
	//PUBLICLY ACCESSIBLE ROUTES
	var publicRoutes = App.route('handlers');
	app.get('/'							, publicRoutes.index);
	app.get('/about'				, publicRoutes.about);
	app.get('/login'				, publicRoutes.login);
	app.get('/signup'				, publicRoutes.signup);
	app.get('/protests/:id'	, publicRoutes.viewProtest);

	// TWITTER NAVBAR SEARCH
	app.get('/results'			, publicRoutes.results);

	// FORMS
	app.post('/signup'			, publicRoutes.addSignup);
	app.post('/login'				, publicRoutes.userLogin);
	app.delete('/logout'		, publicRoutes.logout);

	// USERS ONLY -- AUTHORIZATION REQUIRED
	app.get('/profile'			, publicRoutes.uprofile);
	app.get('/users/:id'		, publicRoutes.viewUser);
	app.get('/users/edit'		, publicRoutes.editUserForm);
	app.patch('/users/:id'	,	publicRoutes.editUser);

	app.get('/protests/new'			, publicRoutes.newProtest);
	app.post('/protests/new'		, publicRoutes.addProtest);
	app.get('/protests/edit'		, publicRoutes.editProtestForm);
	app.patch('/protests/:id'		, publicRoutes.updateProtest);

	// TWITTER AUTHENTICATION
	app.get('/twitter'							, publicRoutes.twitter);
	app.post('/twitter'							, publicRoutes.addTwitter);
	app.get('/auth/twitter'					, publicRoutes.authTwitter);
	app.get('/auth/twitter/callback', publicRoutes.authCallback);

}