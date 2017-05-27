import passport from 'passport';
import LocalStrategy from 'passport-local';

import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import FBUser from '../modules/users/facebook.model';
import User from '../modules/users/user.model';
import constants from '../config/constants';
const FacebookStrategy = require('passport-facebook').Strategy;
import { facebookAuth } from '../config/auth';

// Local Strategy
const localOpts = {
	usernameField: 'email'
};

const localStrategy = new LocalStrategy(
	localOpts,
	async (email, password, done) => {
		try {
			const user = await User.findOne({ email });

			if (!user) {
				return done(null, false);
			} else if (!user.authenticateUser(password)) {
				return done(null, false);
			}

			return done(null, user);
		} catch (err) {
			return done(err, false);
		}
	}
);

// JWT Strategy

const jwtOpts = {
	jwtFromRequest: ExtractJwt.fromAuthHeader('authorization'),
	secretOrKey: constants.JWT_SECRET
};

const jwtStrategy = new JWTStrategy(jwtOpts, async (payload, done) => {
	try {
		const user = await User.findById(payload._id);
		if (!user) {
			return done(null, false);
		}

		return done(null, user);
	} catch (err) {
		return done(err, false);
	}
});

//Facebook Strategy
// const facebookStrategy = new FacebookStrategy(facebookAuth, function(
// 	accessToken,
// 	refreshToken,
// 	profile,
// 	cb
// ) {
// 	process.nextTick(function() {
// 		FBUser.findOne({ id: profile.id }, function(err, user) {
// 			if (err) {
// 				return cb(err, false);
// 			}
// 			if (user) {
// 				return cb(null, user);
// 			} else {
// 				const newUser = new FBUser();
// 				newUser.id = profile.id;
// 				newUser.token = accessToken;
// 				newUser.email = profile.emails[0].value;
// 				newUser.name = profile.name.givenName + ' ' + profile.name.familyName;
// 				newUser.firstName = profile.name.givenName;
// 				newUser.lastName = profile.name.familyName;
//
// 				newUser.save(function(err) {
// 					if (err) {
// 						throw err;
// 					}
// 					return cb(null, newUser);
// 				});
// 			}
// 		});
// 	});

const facebookStrategy = new FacebookStrategy(
	facebookAuth,
	async (accessToken, refreshToken, profile, done) => {
		try {
			const user = await FBUser.findOne({ id: profile.id });
			if (user) {
				return done(null, user);
			} else {
				const newUser = new FBUser();
				newUser.id = profile.id;
				newUser.token = accessToken;
				newUser.email = profile.emails[0].value;
				newUser.name = profile.name.givenName + ' ' + profile.name.familyName;
				newUser.firstName = profile.name.givenName;
				newUser.lastName = profile.name.familyName;
				newUser.save();
				return done(null, newUser);
			}
		} catch (err) {
			return done(err, false);
		}
	}
);

// Saves user to session req.session.passport.user
passport.serializeUser(function(user, cb) {
	cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
	cb(null, obj);
});

passport.use(localStrategy);
passport.use(jwtStrategy);
passport.use(facebookStrategy);

export const authLocal = passport.authenticate('local', { session: false });
export const authJwt = passport.authenticate('jwt', { session: false });
export const authFacebook = passport.authenticate('facebook', {
	session: false
});
