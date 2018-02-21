const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
const bodyParser = require('body-parser');
require('./models/user');
require('./models/survey');
require('./services/passport');
const authRoutes = require('./routes/authRoutes');
const billingRoutes = require('./routes/billingRoutes');
const surveyRoutes = require('./routes/surveyRoutes');

//connect mongoose to mongo remote database
mongoose.connect(keys.mongoURI);

const app = express();

//body parser to parse a post request body
app.use(bodyParser.json());

//enable cookie-session which encrypts and stores cookies in a client
app.use(
	cookieSession({
		maxAge: 30 * 24 * 60 * 60 * 1000,
		keys: [keys.cookieKey],
	})
);

//call initialize middle ware to start authentication
app.use(passport.initialize());

//session middleware to alter session which contains cookies
app.use(passport.session());

//call google auth route handles here
authRoutes(app);

//call strip billing route handlers here
billingRoutes(app);

//survery routes
surveyRoutes(app);

if (process.env.NODE_ENV === 'production') {
	//exprss will serve up static file assets using static middleware
	app.use(express.static('client/build'));

	//express will serve index.html file if it doesnt recognize the route

	const path = require('path');

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

//heroku will inject port into environment variable
const PORT = process.env.PORT || 5000;
app.listen(PORT);
