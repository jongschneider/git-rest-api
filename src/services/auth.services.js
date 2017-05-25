import passport from 'passport';
import LocalStrategy from 'passport-local';

import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';

import { Strategy as FBStrategy } from 'passport-facebook';

import User from '../modules/users/user.model';
import constants from '../config/constants';

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

// Facebook Strategy
const fbOpts = {
	clientID: '798559090299566',
	clientSecret: 'ec67c23c0c1005e468df1f2afcb25d50',
	callbackURL: 'http://localhost:3000/api/v1/users/auth/facebook/callback',
	profileFields: ['emails']
};

const fbCallback = function(accessToken, refreshToken, profile, cb) {
	console.log(profile);
};

const fbStrategy = new FBStrategy(fbOpts, fbCallback);

passport.use(localStrategy);
passport.use(jwtStrategy);
passport.use(fbStrategy);

export const authLocal = passport.authenticate('local', { session: false });
export const authFB = passport.authenticate(
	'facebook',
	// { session: false },
	// { session: false },
	{ scope: ['email'] }
);
export const authJwt = passport.authenticate('jwt', { session: false });
