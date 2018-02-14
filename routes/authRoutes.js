const passport = require('passport');

module.exports = app => {
	//setup a route handler to begin google oauth
	app.get(
		'/auth/google',
		passport.authenticate('google', {
			scope: ['profile', 'email'],
		})
	);

	//now exchange the code for profile information from google
	app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
		res.redirect('/surveys');
	});

	//route to show current logged in user
	app.get('/api/current_user', (req, res) => {
		res.send(req.user);
	});

	//route to logout user and clear cookie
	app.get('/api/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});
};
