const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
require('./models/user');
require('./services/passport');
const authRoutes = require('./routes/authRoutes');

//connect mongoose to mongo remote database
mongoose.connect(keys.mongoURI);

const app = express();

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

//heroku will inject port into environment variable
const PORT = process.env.PORT || 5000;
app.listen(PORT);
