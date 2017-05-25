import express from 'express';
import constants from './config/constants';

import './config/database';

import middelWaresConfig from './config/middlewares';
import apiRoutes from './modules';

//add for FB
var passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy;

const app = express();

middelWaresConfig(app);

app.get('/', (req, res, next) => {
	res.send('all good in the hood.');
});

app.get('/success', (req, res, next) => {
	res.send('success.');
});

//added for FB
app.get('/login/facebook', passport.authenticate('facebook'));

app.get(
	'/login/facebook/return',
	passport.authenticate('facebook', { failureRedirect: '/' }),
	function(req, res) {
		res.redirect('/success');
	}
);

passport.use(
	new FacebookStrategy(
		{
			clientID: '798559090299566',
			clientSecret: 'ec67c23c0c1005e468df1f2afcb25d50',
			callbackURL: 'http://localhost:3000/login/facebook/return',
			profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name'],
			enableProof: true
		},
		function(accessToken, refreshToken, profile, cb) {
			console.log('Your accessToken is :' + accessToken);
			console.log('Your refreshToken is :' + refreshToken);
			console.log('Your profile is :');
			console.log(profile);
			return cb(null, profile);
		}
	)
);

passport.serializeUser(function(user, cb) {
	cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
	cb(null, obj);
});

apiRoutes(app);

app.listen(constants.PORT, err => {
	if (err) {
		throw err;
	} else {
		console.log(
			`
      Server running on port: ${constants.PORT}
      ---
      Running on ${process.env.NODE_ENV}
      `
		);
	}
});
