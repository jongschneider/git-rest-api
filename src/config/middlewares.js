import morgan from 'morgan';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import passport from 'passport';
import session from 'express-session';
const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

export default app => {
	if (isProd) {
		app.use(compression());
		app.use(helmet());
	}
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(
		session({
			secret: 'keyboard cat',
			resave: true,
			saveUninitialized: true
		})
	);
	app.use(passport.initialize());

	if (isDev) {
		app.use(morgan('dev'));
	}
};
